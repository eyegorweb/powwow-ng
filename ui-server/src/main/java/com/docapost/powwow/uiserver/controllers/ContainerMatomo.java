package com.docapost.powwow.uiserver.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.view.AbstractView;
import org.springframework.web.servlet.view.InternalResourceView;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URL;
import java.util.Map;

@Controller()
public class ContainerMatomo {

    @Value("${matomo.url:#{null}}")
    private URL matomoContainerURL = null;

    @Value("${matomo.enabled:false}")
    private boolean enabled;

    @GetMapping(path = "/matomo.js")
    public View matomoContainer() {
        if (enabled && matomoContainerURL != null) {
            return new RedirectView(matomoContainerURL.toString());
        } else {
            return MATOMO_DISABLED_JS_VIEW;
        }
    }

    private static View MATOMO_DISABLED_JS_VIEW = new AbstractView() {
        @Override
        protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {
            response.getWriter().write("window._ANALYTICS_DISABLED=true;");
        }
    };


}
