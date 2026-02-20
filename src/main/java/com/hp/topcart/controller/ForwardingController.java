package com.hp.topcart.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ForwardingController {

    // Forward all non-API paths that don't have an extension
    @RequestMapping(value = { "/{x:[\\w\\-]+}", "/{x:^(?!api$).*$}/**/{y:[\\w\\-]+}" })
    public String redirect() {
        // Forward to home page so that routing is handled by the client (React)
        return "forward:/index.html";
    }
}
