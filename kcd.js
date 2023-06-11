let dob = '1999-03-30'; //Format : 1995-12-25
let moonInfo = "27D 30M 41S of UPh Pada-1"; //Format : 00D 00M 00S of XXX Pada-X

let kcdDisp = document.getElementById("kcd");
let dehaDisp = document.getElementById("deha");
let jeevaDisp = document.getElementById("jeeva");
let dpDisp = document.getElementById("dp");
let submitBtn = document.getElementById('submit');
let resetBtn = document.getElementById('reset');

function onSubmit() {
    submitBtn.disabled = true;
    var dobNew = document.getElementById("dob").value;
    var degrees = document.getElementById("degrees").value;
    var minutes = document.getElementById("minutes").value;
    var seconds = document.getElementById("seconds").value;
    var nakshtra = document.getElementById("nakshatra").value;
    var pada = document.getElementById("pada").value;

    dob = dobNew;
    moonInfo = `${degrees}D ${minutes}M ${seconds}S of ${nakshtra} Pada-${pada}`
    console.log(dob, moonInfo)
    displayKCD(calculateMahadashas());
    return false;
}

function onReset() {
    submitBtn.disabled = false;
    kcdDisp.innerHTML = '';
    jeevaDisp.innerText = '';
    dehaDisp.innerText = '';
    dpDisp.innerText = '';
}

/*------------------Datas and Tables-----------------------------*/
//signs
const signs = [-1, 'Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi']
//Sign Lengths
const signLengths = [-1, 7, 16, 9, 21, 5, 9, 16, 7, 10, 4, 4, 10];
//MD lengths in Savya + Asavya Groups
const savyaMDLengths = [-1, 100, 85, 83, 86, 100, 85, 83, 86, 100, 85, 83, 86];
const asavyaMDLengths = [-1, 86, 83, 85, 100, 86, 83, 85, 100, 86, 83, 85, 100];
//Savya Nakshatra groups - MDs
const savyaGrp = [{
        "nakshatra": ['Ash', 'Pun', 'Has', 'Moo', 'PBh'],
        "dashas": [{
                1: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
            {
                2: [10, 11, 12, 8, 7, 6, 4, 5, 3]
            },
            {
                3: [2, 1, 12, 11, 10, 9, 1, 2, 3]
            },
            {
                4: [4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
        ]
    },
    {
        "nakshatra": ['Bha', 'Pus', 'Chi', 'PAs', 'UBh'],
        "dashas": [{
                5: [8, 7, 6, 4, 5, 3, 2, 1, 12]
            },
            {
                6: [11, 10, 9, 1, 2, 3, 4, 5, 6]
            },
            {
                7: [7, 8, 9, 10, 11, 12, 8, 7, 6]
            },
            {
                8: [4, 5, 3, 2, 1, 12, 11, 10, 9]
            }
        ]
    },
    {
        "nakshatra": ['Kri', 'Ash', 'Swa', 'UAs', 'Rev'],
        "dashas": [{
                9: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
            {
                10: [10, 11, 12, 8, 7, 6, 4, 5, 3]
            },
            {
                11: [2, 1, 12, 11, 10, 9, 1, 2, 3]
            },
            {
                12: [4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
        ]
    }
];
//Asavya Nakshatra Group - MDs
const asavyaGrp = [{
        "nakshatra": ['Roh', 'Mag', 'Vis', 'Shr'],
        "dashas": [{
                8: [9, 10, 11, 12, 1, 2, 3, 5, 4]
            },
            {
                7: [6, 7, 8, 12, 11, 10, 9, 8, 7]
            },
            {
                6: [6, 5, 4, 3, 2, 1, 9, 10, 11]
            },
            {
                5: [12, 1, 2, 3, 5, 4, 6, 7, 8]
            }
        ]
    },
    {
        "nakshatra": ['Mri', 'PPh', 'Anu', 'Dha'],
        "dashas": [{
                4: [12, 11, 10, 9, 8, 7, 6, 5, 4]
            },
            {
                3: [3, 2, 1, 9, 10, 11, 12, 1, 2]
            },
            {
                2: [3, 5, 4, 6, 7, 8, 12, 11, 10]
            },
            {
                1: [9, 8, 7, 6, 5, 4, 3, 2, 1]
            }
        ]
    },
    {
        "nakshatra": ['Ard', 'UPh', 'Jye', 'Sat'],
        "dashas": [{
                12: [12, 11, 10, 9, 8, 7, 6, 5, 4]
            },
            {
                11: [3, 2, 1, 9, 10, 11, 12, 1, 2]
            },
            {
                10: [3, 5, 4, 6, 7, 8, 12, 11, 10]
            },
            {
                9: [9, 8, 7, 6, 5, 4, 3, 2, 1]
            }
        ]
    }
];

/*------------------Functions and Calculations------------------------------*/
let deha = -1,
    jeeva = -1;
//Extract Information from Base Moon String
function getInfoFromMoon(moonInfo) {
    let splitInfo = moonInfo.split(" ");
    let degrees = parseInt(splitInfo[0]);
    let minutes = parseInt(splitInfo[1]);
    let seconds = parseInt(splitInfo[2]);
    let nakshatra = splitInfo[4];
    let nakshatraPada = splitInfo[5].split("-")[1];

    return {
        "degrees": degrees,
        "minutes": minutes,
        "seconds": seconds,
        "nakshatra": nakshatra,
        "nakshatraPada": nakshatraPada
    };
}
//Calclate seconds left to Traverse in Pada
function getSecondsLeftInPada(seconds) {
    seconds /= 1000;
    var remainder = seconds % 12;
    var nearestHighestPadainSeconds = seconds + (12 - remainder);
    return Math.round((nearestHighestPadainSeconds - seconds) * 1000);
}
//Calculate Balance At Birth
function getBalanceAtBirth(imbalancedMD, birthData) {
    let degrees = birthData.degrees;
    let minutes = birthData.minutes;
    let seconds = birthData.seconds;

    let moonLongInSeconds = degrees * 3600 + (minutes * 60) + seconds;
    let secondsLeftToTraverse = getSecondsLeftInPada(moonLongInSeconds);
    const DPDuration = savyaMDLengths[Object.keys(imbalancedMD.dashas)[0]];

    let balanceInYears = (secondsLeftToTraverse * DPDuration) / 12000;
    return balanceInYears;
}
//Caluclate MD Sequence without Balance
function getImbalancedMDSequence(birthData) {
    let nakshatra = birthData.nakshatra;
    let pada = birthData.nakshatraPada - 1;

    let grp1 = savyaGrp.find(grp => grp.nakshatra.indexOf(nakshatra) > -1);
    let grp2 = asavyaGrp.find(grp => grp.nakshatra.indexOf(nakshatra) > -1);

    return grp1 !== undefined ? {
        'dp': 'savya',
        'dashas': grp1.dashas[pada]
    } : {
        'dp': 'asavya',
        'dashas': grp2.dashas[pada]
    };
}
//Convert decimal years to {years, months, days}
function convertDecimalYear(decimalYear) {
    const years = Math.floor(decimalYear);
    const months = Math.floor((decimalYear % 1) * 12);
    const days = Math.floor(((decimalYear % 1) * 12) % 1 * 30.4368); // Average number of days in a month

    const duration = {
        "years": years,
        "months": months,
        "days": days
    };
    return duration;
}
//Adjust imbalanced MD sequence with balance in years
function getAdjustedImbalancedSeqWithBalance(imbalancedMD, convertedBalanceAtBirthInYears) {
    let dashas = imbalancedMD.dashas[Object.keys(imbalancedMD.dashas)[0]];
    console.log(dashas)
    let balanceInYears = convertedBalanceAtBirthInYears.years;
    let i = 0;
    for (i = dashas.length - 1; i >= 0; i--) {
        if (balanceInYears < signLengths[dashas[i]]) break;
        balanceInYears -= signLengths[dashas[i]];
    }
    let adjustedDashas = [Object.keys(imbalancedMD.dashas)[0]].concat(dashas.slice(i).concat(dashas.slice(0, i)));
    let newConvertedBalanceAtBirthInYears = convertedBalanceAtBirthInYears;
    newConvertedBalanceAtBirthInYears.years = balanceInYears;

    return {
        "balancedDasha": adjustedDashas,
        "remainingBalance": newConvertedBalanceAtBirthInYears
    };
}
//Caluclate MD Sequence with Balance
function getBalancedMDSequence(imbalancedMD, birthData, dob) {
    let balanceAtBirthInYears = getBalanceAtBirth(imbalancedMD, birthData);
    console.log(balanceAtBirthInYears)
    let convertedBalanceAtBirthInYears = convertDecimalYear(balanceAtBirthInYears);

    let adjustedDashaData = getAdjustedImbalancedSeqWithBalance(imbalancedMD, convertedBalanceAtBirthInYears);
    console.log(adjustedDashaData)
    const DOB = moment(dob, "YYYY-MM-DD");

    //Generate MD Object with Dates
    let startingDate = moment(DOB);
    let endingDate = moment(DOB).add(adjustedDashaData.remainingBalance.years, 'y').add(adjustedDashaData.remainingBalance.months, 'M').add(adjustedDashaData.remainingBalance.days, 'd');
    startingDate = moment(endingDate).subtract(signLengths[adjustedDashaData.balancedDasha[1]], 'y')
    let mds = adjustedDashaData.balancedDasha.slice(1).map((md, index) => {
        if (index !== 0) {
            startingDate = moment(endingDate);
            endingDate = moment(startingDate).add(signLengths[md], 'y');
        }
        return [md, startingDate.format('YYYY-MM-DD'), endingDate.format('YYYY-MM-DD')];
    });
    return {
        "dp": [imbalancedMD.dp, Object.keys(imbalancedMD.dashas)[0]],
        "dashas": mds
    };
}
//Get Direction Array from MDs
function getDirectionArray(extrapolatedDasha) {
    let directionArray1 = []
    // console.log(extrapolatedDasha)
    for (let i = 1; i < extrapolatedDasha.length; i++) {
        directionArray1[i] = (extrapolatedDasha[i][0] - extrapolatedDasha[i - 1][0]) % 10;
        if ((Math.abs(extrapolatedDasha[i][0] - extrapolatedDasha[i - 1][0])) === 11) directionArray1[i] *= -1;
    }
    directionArray1[0] = 0;
    let i = 1;
    while (i < (directionArray1.length - 1)) {
        if (Math.abs(directionArray1[i]) === Math.abs(directionArray1[i + 1])) break;
        i++;
    }
    let directionArray2 = new Array(directionArray1.length).fill(0);
    let direction = directionArray1[i];
    for (; i < directionArray1.length - 2; i++) {
        if (directionArray1[i] == -directionArray1[i - 1] && directionArray1[i] == directionArray1[i + 1])
            direction = directionArray1[i];
        if (Math.abs(directionArray1[i]) >= 5)
            direction = directionArray1[i + 1];
        directionArray2[i] = direction;
    }
    // console.log(directionArray1)
    // console.log(directionArray2)
    return directionArray2.slice(9, 18);
}
//Calcualte AD Dates
function getDateKCDTable(kcdTable) {
    let finalKCDTable = [];
    let start = moment();
    let end = moment();
    for (let i = 1; i < kcdTable.length; i++) {
        let md = kcdTable[i].md.dasha;
        start = moment(kcdTable[i].md.start);
        finalKCDTable[i] = {
            "md": kcdTable[i].md,
            "ad": []
        }
        let mdEnd = moment(kcdTable[i].md.end);
        for (let j = 0; j < kcdTable[i].ad.length; j++) {
            let ad = kcdTable[i].ad[j];
            let dashaSpan = savyaMDLengths[md];
            let adSpan = (signLengths[md] * signLengths[ad]) / dashaSpan;
            let adSpanData = convertDecimalYear(adSpan);
            end = j === kcdTable[i].ad.length - 1 ? mdEnd : moment(start).add(adSpanData.years, 'y').add(adSpanData.months, 'M').add(adSpanData.days, 'd');
            finalKCDTable[i].ad[j] = {
                "dasha": ad,
                "start": start.format("YYYY-MM-DD"),
                "end": end.format("YYYY-MM-DD")
            }
            start = moment(end);
        }
    }
    finalKCDTable[0] = kcdTable[0];
    return finalKCDTable;
}
//Calcualte AD
function getADsFromBalancedMD(balancedMD) {
    let extrapolatedDasha = balancedMD.dashas.concat(balancedMD.dashas).concat(balancedMD.dashas);
    let directionArr = getDirectionArray(extrapolatedDasha)
    // console.log(balancedMD.dashas);

    let adTable = []
    savyaGrp.forEach(grp => {
        adTable.push(...grp.dashas)
    })
    adTable = adTable.map(ads => ads[Object.keys(ads)[0]])

    let kcdTable = [];
    for (let i = 0; i < balancedMD.dashas.length; i++) {
        kcdTable[i] = {
            "md": {
                "dasha": balancedMD.dashas[i][0],
                "start": balancedMD.dashas[i][1],
                "end": balancedMD.dashas[i][2]

            },
            "ad": directionArr[i] > 0 ? adTable[balancedMD.dashas[i][0] - 1] : adTable[balancedMD.dashas[i][0] - 1].reverse()
        }
    }
    kcdTable = [{
        "dp": balancedMD.dp
    }].concat(kcdTable)

    let finalKCDMatrix = getDateKCDTable(kcdTable);
    return finalKCDMatrix
}
//Calcualte the MD 
function calculateMahadashas() {
    let birthData = getInfoFromMoon(moonInfo);
    // console.log(birthData);
    //Get the MD sequence without balance
    let imbalancedMD = getImbalancedMDSequence(birthData);
    //Set Deha and Jeev Rashis
    switch (imbalancedMD.dp) {
        case 'savya':
            deha = imbalancedMD.dashas[Object.keys(imbalancedMD.dashas)[0]][0];
            jeeva = imbalancedMD.dashas[Object.keys(imbalancedMD.dashas)[0]].at(-1);
            break;
        case 'asavya':
            jeeva = imbalancedMD.dashas[Object.keys(imbalancedMD.dashas)[0]][0];
            deha = imbalancedMD.dashas[Object.keys(imbalancedMD.dashas)[0]].at(-1);
            break;

    }
    let balancedMD = getBalancedMDSequence(imbalancedMD, birthData, dob);
    let dashaMatrix = getADsFromBalancedMD(balancedMD);
    console.log(dashaMatrix)
    return dashaMatrix;
}

function displayKCD(dashaMatrix) {
    console.log(dashaMatrix)
    kcdDisp.innerHTML = '';
    jeevaDisp.innerText = signs[jeeva];
    dehaDisp.innerText = signs[deha];
    dpDisp.innerText = `${dashaMatrix[0].dp[0]} - ${signs[dashaMatrix[0].dp[1]]}`;
    for (let i = 1; i < dashaMatrix.length; i++) {
        let trMD = document.createElement("tr");
        trMD.classList.add("table-warning");
        trMD.innerHTML = `<td><b>${signs[dashaMatrix[i].md.dasha]}</b></td>
        <td>${dashaMatrix[i].md.start} - ${dashaMatrix[i].md.end}</td>`;
        kcdDisp.appendChild(trMD);
        dashaMatrix[i].ad.forEach(adasha => {
            let trAD = document.createElement('tr');
            trAD.innerHTML = `<td><i>${signs[adasha.dasha]}</i></td>
            <td><i>${adasha.start} - ${adasha.end}</i></td>`;
            kcdDisp.appendChild(trAD);
        });
    }
}