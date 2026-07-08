package com.example.smartworkspace.controllers;

import com.example.smartworkspace.services.PayOSWebhookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.payos.model.webhooks.Webhook;

@RestController
@RequestMapping("/api/payments/payos")
@RequiredArgsConstructor
public class PayOSWebhookController {

    private final PayOSWebhookService webhookService;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody Webhook webhook) {
        webhookService.handle(webhook);
        return ResponseEntity.ok("OK");
    }
}
