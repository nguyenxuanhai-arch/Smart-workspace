package com.example.smartworkspace.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LocationService {

    private final RestTemplate restTemplate;
    private final ConcurrentHashMap<String, String> cache = new ConcurrentHashMap<>();

    public LocationService() {
        this.restTemplate = new RestTemplate();
    }

    public String getProvinces() {
        return cache.computeIfAbsent("provinces", k -> {
            String url = "https://provinces.open-api.vn/api/v2/?depth=1";
            return restTemplate.getForObject(url, String.class);
        });
    }

    public String getWardsByProvince(Integer provinceCode) {
        return cache.computeIfAbsent("province_" + provinceCode, k -> {
            String url = "https://provinces.open-api.vn/api/v2/p/" + provinceCode + "?depth=2";
            return restTemplate.getForObject(url, String.class);
        });
    }
}
