$(document).ready(function()
{ 
    var count = 0;

    $('.FixedTrans').click(function () 
    {

        $("#fixedTransContainer").append('<p> <input type="text" '
        + 
        'name="budget[fixedCosts][' + count.toString() + '][name]" class ="textsize" placeholder="Name of Transaction">' 
        + 
        '<input type="number" class ="textsize" placeholder="Value of Transaction"'
        +
        'name="budget[fixedCosts][' + count.toString() + '][amount]">'
        +
        '<button type="button" class="ui red button butsize remove num' + count.toString() + '">Remove</button>' + '</p>');



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