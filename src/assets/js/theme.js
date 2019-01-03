// Custome theme code

if ($('.clean-gallery').length > 0) {
   baguetteBox.run('.clean-gallery', { animation: 'slideIn'});
}

if ($('.clean-productNameControlInput').length > 0) {
    $(window).on("load",function() {
        $('.sp-wrap').smoothproducts();
    });
}

