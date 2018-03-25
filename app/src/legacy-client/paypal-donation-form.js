$(function(){
    if ($('#webcaptioner-donation-form').length) {
        $('#webcaptioner-donation-form input, #webcaptioner-donation-form select').on('change keyup', function(){

            // a3 is used for subscriptions; amount is used for regular one-time donations
            $('[name="amount"]').val($('[name="a3"]').val());

            switch ($('[name="recurrence"]').val()) {
                case "oneTime":
                    /* Also change default HTML on /donate match this */
                    $('[name="cmd"]').val('_donations');
                    $('[name="src"]').val('0');
                    $('[name="p3"]').val('1');
                    $('[name="t3"]').val('D');
                    break;
                case "weekly":
                    $('[name="cmd"]').val('_xclick-subscriptions');
                    $('[name="src"]').val('1');
                    $('[name="p3"]').val('1');
                    $('[name="t3"]').val('W');
                    break;
                case "everyOtherWeek":
                    $('[name="cmd"]').val('_xclick-subscriptions');
                    $('[name="src"]').val('1');
                    $('[name="p3"]').val('2');
                    $('[name="t3"]').val('W');
                    break;
                case "monthly":
                    $('[name="cmd"]').val('_xclick-subscriptions');
                    $('[name="src"]').val('1');
                    $('[name="p3"]').val('1');
                    $('[name="t3"]').val('M');
                    break;
                case "everyThreeMonths":
                    $('[name="cmd"]').val('_xclick-subscriptions');
                    $('[name="src"]').val('1');
                    $('[name="p3"]').val('3');
                    $('[name="t3"]').val('M');
                    break;
            }
        });
    }
});