package com.example.smartworkspace.controllers;

import com.example.smartworkspace.services.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping(value = "/provinces", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getProvinces() {
        return ResponseEntity.ok(locationService.getProvinces());
    }

    @GetMapping(value = "/provinces/{code}/wards", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getWardsByProvince(@PathVariable Integer code) {
        return ResponseEntity.ok(locationService.getWardsByProvince(code));
    }
}
