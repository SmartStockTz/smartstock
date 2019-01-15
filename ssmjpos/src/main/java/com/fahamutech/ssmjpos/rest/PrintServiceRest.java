package com.fahamutech.ssmjpos.rest;

import com.fahamutech.ssmjpos.service.MyPrinterService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
public class PrintServiceRest {
    private MyPrinterService myPrinterService;

    PrintServiceRest(MyPrinterService myPrinterService) {
        this.myPrinterService = myPrinterService;
    }

    @RequestMapping("/print")
    public String print(HttpServletRequest request) {
        String data = request.getParameter("data");
        String id = request.getParameter("id");
        String header =
                "          #" + id + "\n" +
                "           Lb Pharmacy Ltd     \n" +
                "       Gongo La Mboto Stand\n" +
                "           P.O.Box 41593\n" +
                "      number: +255717959146\n" +
                data;

        String footer =
                "\n" +
                        "***********************************\n" +
                        "Kusoma oda piga \n" +
                        "1. 0684972687\n" +
                        "2. 0714702887\n" +
                        "3. 0768316283\n\n" +
                        "***************************************\n\n\n\n\n\n";
        String concat = header.concat(footer);
        myPrinterService.printString("TM-T20II", concat);
        // cut that paper!
        byte[] cutP = new byte[]{0x1d, 'V', 1};
        myPrinterService.printBytes("TM-T20II", cutP);
        return data;
    }
}
