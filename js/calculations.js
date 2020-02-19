var bbp = true, gold = true, plat = true, cfu = true, cf = true, csr = true;
var lineChart;

function setValues(){
    // main driver function, obtains and validates values and sets output in the document
    var monthlyRestaurantSpend, monthlyGrocerySpend, monthlyFlightSpend, monthlyCFSpend, monthlyMiscSpend;
    var monthlySpendTotal, AMEXBenefitsTotal, ChaseBenefitsTotal, monthlyMRTotal, monthlyURTotal;
    var monthlyMRValuation, yearlyMRValuation, monthlyURValuation, yearlyURValuation;
    var yearlySpendTotal, yearlyMRTotal, yearlyURTotal;
    var ctx;
    var chaseAF, amexAF;

    // monthly personal spend
    monthlyRestaurantSpend = parseFloat(document.getElementById('monthlyRestaurantInput').value);
    monthlyGrocerySpend = parseFloat(document.getElementById('monthlyGroceryInput').value);
    monthlyFlightSpend = parseFloat(document.getElementById('monthlyFlightInput').value);
    monthlyCFSpend = parseFloat(document.getElementById('freedomSpend').value);
    monthlyMiscSpend = parseFloat(document.getElementById('monthlyMiscInput').value);

    //input validation
    if (isNaN(monthlyRestaurantSpend))
        monthlyRestaurantSpend = 0;
    if (isNaN(monthlyGrocerySpend))
        monthlyGrocerySpend = 0;
    if (isNaN(monthlyFlightSpend))
        monthlyFlightSpend = 0;
    if (isNaN(monthlyMiscSpend))
        monthlyMiscSpend = 0;
    if (isNaN(monthlyCFSpend))
        monthlyCFSpend = 0;

    // benefits input/validation
    AMEXBenefitsTotal = getAmexBenefits();
    ChaseBenefitsTotal = getChaseBenefits();

    // monthly calculations, spend total, point totals and valuations
    monthlySpendTotal = monthlyRestaurantSpend + monthlyGrocerySpend + monthlyFlightSpend + monthlyCFSpend + monthlyMiscSpend;

    monthlyMRTotal = monthlyMRCalculation(monthlyRestaurantSpend, monthlyGrocerySpend, monthlyFlightSpend, monthlyCFSpend, monthlyMiscSpend);
    monthlyMRValuation = redemptionMultiplierMR(monthlyMRTotal);

    monthlyURTotal = monthlyURCalculation(monthlyRestaurantSpend, monthlyGrocerySpend, monthlyFlightSpend, monthlyCFSpend, monthlyMiscSpend);
    monthlyURValuation = redemptionMultiplierUR(monthlyURTotal);

    // set monthly summaries
    // document.getElementById('monthlyTotal').innerHTML = Math.round(monthlySpendTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // document.getElementById('monthlyTotalMR').innerHTML = Math.round(monthlyMRTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // document.getElementById('monthlyTotalUR').innerHTML = Math.round(monthlyURTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // document.getElementById('monthlyMRValuation').innerHTML = Math.round(monthlyMRValuation).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // document.getElementById('monthlyURValuation').innerHTML = Math.round(monthlyURValuation).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // yearly calculation
    yearlySpendTotal = monthlySpendTotal * 12;
    yearlyMRTotal = monthlyMRTotal * 12;
    yearlyURTotal = monthlyURTotal * 12;
    yearlyMRValuation = monthlyMRValuation * 12 + AMEXBenefitsTotal;
    yearlyURValuation = monthlyURValuation * 12 + ChaseBenefitsTotal;

    // set values in document
    document.getElementById('totalOutput').innerHTML = Math.round(yearlySpendTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('totalAMEXBenefits').innerHTML = Math.round(AMEXBenefitsTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('totalChaseBenefits').innerHTML = Math.round(ChaseBenefitsTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('totalMR').innerHTML = Math.round(yearlyMRTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('totalUR').innerHTML = Math.round(yearlyURTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // document.getElementById('yearlyMRValuation').innerHTML = Math.round(yearlyMRValuation).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // document.getElementById('yearlyURValuation').innerHTML = Math.round(yearlyURValuation).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    chaseAF = getChaseAF();
    amexAF = getAMEXAF();

    document.getElementById('totalAMEXFees').innerHTML = amexAF.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('totalChaseFees').innerHTML = chaseAF.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    monthlyMRValuation = Math.round(monthlyMRValuation);
    monthlyURValuation = Math.round(monthlyURValuation);

    generateChart(chaseAF, amexAF, monthlyMRValuation, monthlyURValuation, AMEXBenefitsTotal, ChaseBenefitsTotal);
}

function generateChart(chaseAF, amexAF, monthlyMRValuation, monthlyURValuation, AMEXBenefitsTotal, ChaseBenefitsTotal){
    // create function data
    var chaseMonthly = new Array(24);
    var amexMonthly = new Array(24);
    var mrVal = monthlyMRValuation;
    var urVal = monthlyURValuation;
    var months = new Array(24);

    for (i = 0; i < 24; i++){
        if (i == 12){
            mrVal -= amexAF;
            urVal -= chaseAF;
            mrVal += AMEXBenefitsTotal;
            urVal += ChaseBenefitsTotal;
        }
        amexMonthly.push(mrVal);
        chaseMonthly.push(urVal);
        urVal += monthlyURValuation;
        mrVal += monthlyMRValuation;
        months.push(i + 1);
    }

    // ok i dont really know whats going on here but extra stuff is appended to the beginning of the arrays
    for (i = 0; i < 24; i++){
        amexMonthly.shift();
        chaseMonthly.shift();
        months.shift();
    }

    // chartjs needs cleared references of any old chart
    if(lineChart)
        lineChart.destroy();

    // make the graph bro
    ctx = document.getElementById('myChart').getContext('2d');
    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{ 
                data: amexMonthly,
                label: "American Express",
                borderColor: "#3e95cd",
                fill: false
              }, { 
                data: chaseMonthly,
                label: "Chase",
                borderColor: "#8e5ea2",
                fill: false
              }
            ]
              },
            options: {
                legend: {fillStyle: Color},
                responsive: true,
                title: {
                  display: true,
                  text: 'AMEX MR vs. Chase UR Valuation over 24 months'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel:{
                            display: true,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Valuation in $'
                        }
                    }]
                }
          }
    });
}

function getChaseAF(){
    var annualFee = 0;
    if (csr)
        annualFee += 450;
    return annualFee;
}

function getAMEXAF(){
    var annualFee = 0;
    if (plat)
        annualFee += 550;
    if (gold)
        annualFee += 250;
    return annualFee;
}

function getChaseBenefits(){
    // obtains and validates yearly card benefits
    var travelCredit, miscCredit;

    travelCredit = parseFloat(document.getElementById('travelCreditInput').value);
    miscCredit = parseFloat(document.getElementById('chaseMiscCreditsInput').value);

    if (isNaN(travelCredit) || document.getElementById('travelCreditInput').disabled)
        travelCredit = 0;
    if (isNaN(miscCredit) || document.getElementById('chaseMiscCreditsInput').disabled)
        miscCredit = 0;

    return travelCredit + miscCredit;
}

function getAmexBenefits(){
    // obtains and validates yearly card benefits
    var airlineFeeCredit, diningCredit, securityFeeCredit, uberCredit, saksFifthCredit, miscCredit;

    airlineFeeCredit = parseFloat(document.getElementById('monthlyAirlineFeeInput').value);
    diningCredit = parseFloat(document.getElementById('monthlyDiningCreditInput').value);
    securityFeeCredit = parseFloat(document.getElementById('securityFeeCreditInput').value);
    uberCredit = parseFloat(document.getElementById('uberCreditInput').value);
    saksFifthCredit = parseFloat(document.getElementById('saksFifthInput').value);
    miscCredit = parseFloat(document.getElementById('amexMiscCreditsInput').value);

    //input validation/check if box is disabled
    if (isNaN(airlineFeeCredit) || document.getElementById('monthlyAirlineFeeInput').disabled)
        airlineFeeCredit = 0;
    if (isNaN(diningCredit) || document.getElementById('monthlyDiningCreditInput').disabled)
        diningCredit = 0;
    if (isNaN(securityFeeCredit) || document.getElementById('securityFeeCreditInput').disabled)
        securityFeeCredit = 0;
    if (isNaN(uberCredit) || document.getElementById('uberCreditInput').disabled)
        uberCredit = 0;
    if (isNaN(saksFifthCredit) || document.getElementById('saksFifthInput').disabled)
        saksFifthCredit = 0;
    if (isNaN(miscCredit))
        miscCredit = 0;

    // spread out over 4 years, temporary add detail later
    securityFeeCredit = securityFeeCredit / 4;
    return airlineFeeCredit + diningCredit + securityFeeCredit + uberCredit + saksFifthCredit + miscCredit;
}

function redemptionMultiplierUR(monthlyURTotal){
    if (document.getElementById('monthlyCreditsRadio').checked == true){
        return monthlyURTotal / 100
    }
    else if (document.getElementById('monthlyTravelRadio').checked == true){
        if (csr)
            return (monthlyURTotal * 1.5) / 100

        else
            return monthlyURTotal / 100
    }
    else if (document.getElementById('monthlyTransferRadio').checked == true){
        if (csr)
            return monthlyURTotal * 2 / 100
        else{
            M.toast({html: 'The Chase Sapphire Reserve must be selected to redeem with Chase transfer partners.'})
            return monthlyURTotal / 100  
        }
    }
}

function redemptionMultiplierMR(monthlyMRTotal){
    // calculate with redemption method
    if (document.getElementById('monthlyCreditsRadio').checked == true)
        return (monthlyMRTotal * 0.6)  / 100
    else if (document.getElementById('monthlyTravelRadio').checked == true)
        return monthlyMRTotal / 100
    else if (document.getElementById('monthlyTransferRadio').checked == true)
        return monthlyMRTotal * 2 / 100
}

function monthlyURCalculation(monthlyRestaurantSpend, monthlyGrocerySpend, monthlyFlightSpend, monthlyCFSpend, monthlyMiscSpend){
    var restaurantMultiplier = 1, travelMultiplier = 1, miscMultiplier = 1, freedomMultiplier = 1;

    monthlyMiscSpend += monthlyGrocerySpend;      
    if (csr){
        M.toast({html: 'NOTE: CSR values are not up to date with 2020 benefits.'})  
    }

    if (cfu && cf && csr){                 //ttt     
        travelMultiplier = restaurantMultiplier = 3;
        freedomMultiplier = 5;
        miscMultiplier = 1.5;
    } else if (cfu && cf && !csr){         //ttf
        freedomMultiplier = 5;
        miscMultiplier = travelMultiplier = restaurantMultiplier = 1.5;
    } else if (cfu && !cf && csr){         //tft
        travelMultiplier = restaurantMultiplier = 3;
        freedomMultiplier = miscMultiplier = 1.5;
    } else if (!cfu && cf && csr){         //ftt
        travelMultiplier = restaurantMultiplier = 3;
        freedomMultiplier = 5;
    } else if (cfu && !cf && !csr){        //tff
        restaurantMultiplier = travelMultiplier = freedomMultiplier = miscMultiplier = 1.5;
    } else if (!cfu && cf && !csr){        //ftf
        freedomMultiplier = 5;
    } else if (!cfu && !cf && csr){        //fft
        travelMultiplier = 3;
        restaurantMultiplier = 3;
    } else {
        M.toast({html: 'Select at least one card from Chase for proper valuation.'})  
    }
    return monthlyRestaurantSpend * restaurantMultiplier + 
        monthlyFlightSpend * travelMultiplier + 
        monthlyCFSpend * freedomMultiplier + 
        monthlyMiscSpend * miscMultiplier
}

function monthlyMRCalculation(monthlyRestaurantSpend, monthlyGrocerySpend, monthlyFlightSpend, monthlyCFSpend, monthlyMiscSpend){
    // calculations monthly MR valuation depending on card combinations and spend categories
    var restaurantMultiplier = 1, groceryMultiplier = 1, flightMultiplier = 1, miscMultiplier = 1;
    monthlyMiscSpend += monthlyCFSpend;

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
        M.toast({html: 'Select at least one card from American Express for proper valuation.'})
    }

    return monthlyRestaurantSpend * restaurantMultiplier + 
        monthlyGrocerySpend * groceryMultiplier + 
        monthlyFlightSpend * flightMultiplier + 
        monthlyMiscSpend * miscMultiplier;
}


// amex activation functions
function setPlat(){
    if (plat){
        plat = false;
        $("#platToggle").html('<i class="material-icons">add</i>');
        $('#securityFeeCreditInput').prop('disabled', true).addClass('disabled').off( "click" );
        $('#uberCreditInput').prop('disabled', true).addClass('disabled').off( "click" );
        $('#saksFifthInput').prop('disabled', true).addClass('disabled').off( "click" );
        if (!gold)
            $('#monthlyAirlineFeeInput').prop('disabled', true).addClass('disabled').off( "click" );
        setValues();
    }
    else{
        plat = true;
        $("#platToggle").html('<i class="material-icons">check</i>'); 
        $('#securityFeeCreditInput').prop('disabled', false).addClass('disabled').off( "click" );
        $('#uberCreditInput').prop('disabled', false).addClass('disabled').off( "click" );
        $('#monthlyAirlineFeeInput').prop('disabled', false).addClass('disabled').off( "click" );
        $('#saksFifthInput').prop('disabled', false).addClass('disabled').off( "click" );
        setValues();
    }
}

function setGold(){
    if (gold){
        gold = false;
        $("#goldToggle").html('<i class="material-icons">add</i>'); 
        if (!plat)
            $('#monthlyAirlineFeeInput').prop('disabled', true).addClass('disabled').off( "click" );
        $('#monthlyDiningCreditInput').prop('disabled', true).addClass('disabled').off( "click" );
        setValues();
    }
    else{
        gold = true;
        $("#goldToggle").html('<i class="material-icons">check</i>');
        $('#monthlyAirlineFeeInput').prop('disabled', false).addClass('disabled').off( "click" );
        $('#monthlyDiningCreditInput').prop('disabled', false).addClass('disabled').off( "click" );
        setValues();

    }
}

function setBBP(){
    if (bbp){
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


//chase activation functions
function setCSR(){
    if (csr){
        csr = false;
        $("#csrToggle").html('<i class="material-icons">add</i>'); 
        $('#travelCreditInput').prop('disabled', true).addClass('disabled').off( "click" );
        setValues();
    }
    else{
        csr = true;
        $("#csrToggle").html('<i class="material-icons">check</i>');
        $('#travelCreditInput').prop('disabled', false).addClass('disabled').off( "click" );
        setValues();
    }
}

function setCF(){
    if (cf){
        cf = false;
        $("#cfToggle").html('<i class="material-icons">add</i>'); 
        setValues();
    }
    else{
        cf = true;
        $("#cfToggle").html('<i class="material-icons">check</i>');
        setValues();
    }
}

function setCFU(){
    if (cfu){
        cfu = false;
        $("#cfuToggle").html('<i class="material-icons">add</i>'); 
        setValues();
    }
    else{
        cfu = true;
        $("#cfuToggle").html('<i class="material-icons">check</i>');
        setValues();
    }
}