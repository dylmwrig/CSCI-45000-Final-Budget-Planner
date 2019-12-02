$(document).ready(function()
{ 
    var count = 0;

    $('.FixedTrans').click(function () 
    {

        $("#fixedTransContainer").append('<p> <input type="text" '
        + 
        'name="budget[fixedCosts][' + count.toString() + '][description]" class ="textsize" placeholder="Name of Transaction">' 
        + 
        '<input type="number" class ="textsize" placeholder="Value of Transaction"'
        +
        'name="budget[fixedCosts][' + count.toString() + '][amount]">'
         + '</p>');



        $(".textsize").css({"width":"28%", "margin-right":"5px"}); 
        $(".butsize").css({"width":"15%"}); 

/*         $('.num' + count.toString()).click(function () 
        {
            alert('Clicked but' + count.toString());
            $('.num' + count.toString()).remove();
        }); */
        
        count++;
    });

    
});
