$(function(){
    if ($('#webcaptioner-donation-form').length) {
        $('[name="recurrence"]').on('change', function(){
            switch ($(this).val()) {
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