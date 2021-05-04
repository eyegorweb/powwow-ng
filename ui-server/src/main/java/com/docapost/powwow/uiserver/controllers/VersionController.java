package com.docapost.powwow.uiserver.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.info.BuildProperties;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
public class VersionController {
    @Autowired
    BuildProperties buildProperties;

    @GetMapping(path = "/getversion")
    public String versionRoute() {
        return this.buildProperties.getVersion();
    }
}
