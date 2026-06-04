package com.example.smartworkspace.services;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.dtos.cart.CartItemRequest;
import com.example.smartworkspace.dtos.cart.CartItemUpdateRequest;
import com.example.smartworkspace.dtos.cart.CartResponse;
import com.example.smartworkspace.entities.Cart;
import com.example.smartworkspace.entities.CartItem;
import com.example.smartworkspace.entities.Product;
import com.example.smartworkspace.entities.User;
import com.example.smartworkspace.enums.CartStatus;
import com.example.smartworkspace.enums.ProductStatus;
import com.example.smartworkspace.mappers.CartMapper;
import com.example.smartworkspace.repositories.CartItemRepository;
import com.example.smartworkspace.repositories.CartRepository;
import com.example.smartworkspace.repositories.ProductRepository;
import com.example.smartworkspace.repositories.UserRepository;
import com.example.smartworkspace.securities.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    @Transactional
    public CartResponse getMyCart() {
        Cart cart = getOrCreateActiveCart();
        return toResponse(cart);
    }

    @Transactional
    public CartResponse addItem(CartItemRequest request) {
        Cart cart = getOrCreateActiveCart();
        Product product = getActiveProduct(request.getProductId());
        int requestedQuantity = request.getQuantity();

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);
        if (item == null) {
            ensureStockAvailable(product, requestedQuantity);
            item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(requestedQuantity);
            item.setUnitPrice(product.getPrice());
        } else {
            int newQuantity = item.getQuantity() + requestedQuantity;
            ensureStockAvailable(product, newQuantity);
            item.setQuantity(newQuantity);
        }

        cartItemRepository.save(item);
        return toResponse(cart);
    }

    @Transactional
    public CartResponse updateItem(Long itemId, CartItemUpdateRequest request) {
        Cart cart = getOrCreateActiveCart();
        CartItem item = getMyCartItem(cart, itemId);
        ensureStockAvailable(item.getProduct(), request.getQuantity());
        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);
        return toResponse(cart);
    }

    @Transactional
    public void deleteItem(Long itemId) {
        Cart cart = getOrCreateActiveCart();
        CartItem item = getMyCartItem(cart, itemId);
        cartItemRepository.delete(item);
    }

    private CartResponse toResponse(Cart cart) {
        return cartMapper.toResponse(cart, cartItemRepository.findByCartIdOrderByCreatedAtAsc(cart.getId()));
    }

    private Cart getOrCreateActiveCart() {
        Long userId = getCurrentUserId();
        return cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE)
                .orElseGet(() -> createActiveCart(userId));
    }

    private Cart createActiveCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setStatus(CartStatus.ACTIVE);
        return cartRepository.save(cart);
    }

    private CartItem getMyCartItem(Cart cart, Long itemId) {
        return cartItemRepository.findByIdAndCartId(itemId, cart.getId())
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));
    }

    private Product getActiveProduct(Long productId) {
        return productRepository.findById(productId)
                .filter(product -> product.getStatus() == ProductStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    private void ensureStockAvailable(Product product, int quantity) {
        if (product.getStatus() != ProductStatus.ACTIVE
                || product.getStockQuantity() == null
                || product.getStockQuantity() < quantity) {
            throw new AppException(ErrorCode.OUT_OF_STOCK);
        }
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return userDetails.getUser().getId();
    }
}
