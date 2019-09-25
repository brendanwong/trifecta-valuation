var bbp = true, gold = true, plat = true, cfu = true, csp = true, csr = true;


function setValues(){
    // obtains, validates, and sets values from and in the document
    var monthlyRestaurantSpend, monthlyGrocerySpend, monthlyFlightSpend, monthlyMiscSpend;
    var monthlyAirlineFeeCredit, monthlyDiningCredit;
    var monthlySpendTotal, benefitsTotal, monthlyPointsTotal;
    var monthlyPointsValuation, yearlyPointsValuation;

    // monthly personal spend
    monthlyRestaurantSpend = parseFloat(document.getElementById('monthlyRestaurantInput').value);
    monthlyGrocerySpend = parseFloat(document.getElementById('monthlyGroceryInput').value);
    monthlyFlightSpend = parseFloat(document.getElementById('monthlyFlightInput').value);
    monthlyMiscSpend = parseFloat(document.getElementById('monthlyMiscInput').value);

    // benefits
    monthlyAirlineFeeCredit = parseFloat(document.getElementById('monthlyAirlineFeeInput').value);
    monthlyDiningCredit = parseFloat(document.getElementById('monthlyDiningCreditInput').value);

    //input validation
    if (isNaN(monthlyRestaurantSpend))
        monthlyRestaurantSpend = 0;
    if (isNaN(monthlyGrocerySpend))
        monthlyGrocerySpend = 0;
    if (isNaN(monthlyFlightSpend))
        monthlyFlightSpend = 0;
    if (isNaN(monthlyMiscSpend))
        monthlyMiscSpend = 0;

    if (isNaN(monthlyAirlineFeeCredit))
        monthlyAirlineFeeCredit = 0;
    if (isNaN(monthlyDiningCredit))
        monthlyDiningCredit = 0;


    // calculations
    monthlySpendTotal = monthlyRestaurantSpend + monthlyGrocerySpend + monthlyFlightSpend + monthlyMiscSpend;
    benefitsTotal = monthlyAirlineFeeCredit + monthlyDiningCredit;
    monthlyPointsTotal = monthlyMRCalculation(monthlyRestaurantSpend, monthlyGrocerySpend, monthlyFlightSpend, monthlyMiscSpend);
    monthlyPointsValuation = redemptionMultiplier(monthlyPointsTotal);

    monthlyPointsValuation = monthlyPointsValuation + benefitsTotal;
    yearlyPointsValuation = monthlyPointsValuation * 12 + benefitsTotal;

    // set values in document
    document.getElementById('monthlyTotal').innerHTML = Math.round(monthlySpendTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('monthlyBenefits').innerHTML = Math.round(benefitsTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('monthlyTotalPoints').innerHTML = Math.round(monthlyPointsTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('monthlyMRValuation').innerHTML = Math.round(monthlyPointsValuation).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // yearly stuff
    var yearlySpendTotal = monthlySpendTotal * 12;
    var yearlyPointsTotal = monthlyPointsTotal * 12;

    document.getElementById('totalOutput').innerHTML = Math.round(yearlySpendTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('totalBenefits').innerHTML = Math.round(benefitsTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('totalPoints').innerHTML = Math.round(yearlyPointsTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('yearlyMRValuation').innerHTML = Math.round(yearlyPointsValuation).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function redemptionMultiplier(monthlyPointsTotal){
    // calculate with redemption method
    if (document.getElementById('monthlyCreditsRadio').checked == true)
        return (monthlyPointsTotal * 0.6)  / 100
    else if (document.getElementById('monthlyTravelRadio').checked == true)
        return monthlyPointsTotal / 100
    else if (document.getElementById('monthlyTransferRadio').checked == true)
        return monthlyPointsTotal * 2 / 100
}

function monthlyMRCalculation(monthlyRestaurantSpend, monthlyGrocerySpend, monthlyFlightSpend, monthlyMiscSpend){
    // calculations monthly MR valuation depending on card combinations and spend categories
    var restaurantMultiplier = 1, groceryMultiplier = 1, flightMultiplier = 1, miscMultiplier = 1;

    if (bbp && gold && plat){                                   //ttt
        flightMultiplier = 5;
        restaurantMultiplier = groceryMultiplier = 4;
        miscMultiplier = 2;
    } else if (bbp && gold && !plat){                           //ttf
        restaurantMultiplier = groceryMultiplier = 4;
        flightMultiplier = 3;
        miscMultiplier = 2;
    } else if (bbp && !gold && plat){                           //tft
        flightMultiplier = 5;
        restaurantMultiplier = groceryMultiplier = miscMultiplier = 2;
    } else if (!bbp && gold && plat){                           //ftt
        flightMultiplier = 5;
        groceryMultiplier = restaurantMultiplier = 4;
    } else if (bbp && !gold && !plat){                          //tff
        flightMultiplier = groceryMultiplier = restaurantMultiplier = miscMultiplier = 2;
    } else if (!bbp && gold && !plat){                          //ftf
        restaurantMultiplier = groceryMultiplier = 4;
        flightMultiplier = 3;
    } else if (!bbp && !gold && plat){                          //fft
        flightMultiplier = 5;
    } else {                                                    //fff
        M.toast({html: 'Select at least one card from each trifecta for proper valuation.'})
    }

    return monthlyRestaurantSpend * restaurantMultiplier + 
        monthlyGrocerySpend * groceryMultiplier + 
        monthlyFlightSpend * flightMultiplier + 
        monthlyMiscSpend * miscMultiplier;
}

// bbp, gold, plat, cfu, csp, csr;
function setPlat(){
    if (plat == true){
        plat = false;
        $("#platToggle").html('<i class="material-icons">add</i>'); 
        setValues();
    }
    else{
        plat = true;
        $("#platToggle").html('<i class="material-icons">check</i>'); 
        setValues();

    }
}
// function setCSR(){
//     if (csr == true){
//         csr = false;
//         $("#csrToggle").html('<i class="material-icons">add</i>'); 
//     }
//     else{
//         csr = true;
//         $("#csrToggle").html('<i class="material-icons">check</i>');
//     }
// }
function setGold(){
    if (gold == true){
        gold = false;
        $("#goldToggle").html('<i class="material-icons">add</i>'); 
        setValues();

    }
    else{
        gold = true;
        $("#goldToggle").html('<i class="material-icons">check</i>');
        setValues();

    }
}
// function setCSP(){
//     if (csp == true){
//         csp = false;
//         $("#cspToggle").html('<i class="material-icons">add</i>'); 
//     }
//     else{
//         csp = true;
//         $("#cspToggle").html('<i class="material-icons">check</i>');
//     }
// }
function setBBP(){
    if (bbp == true){
        bbp = false;
        $("#bbpToggle").html('<i class="material-icons">add</i>'); 
        setValues();

    }
    else{
        bbp = true;
        $("#bbpToggle").html('<i class="material-icons">check</i>');
        setValues();

    }
}
// function setCFU(){
//     if (cfu == true){
//         cfu = false;
//         $("#cfuToggle").html('<i class="material-icons">add</i>'); 
//     }
//     else{
//         cfu = true;
//         $("#cfuToggle").html('<i class="material-icons">check</i>');
//     }
// }