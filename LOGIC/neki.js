var holidays = []
document.addEventListener('DOMContentLoaded', function () {
    fetch('holidays.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            holidays = data.split('\n')
            updateOutput(new Date().getMonth() + 1, new Date().getFullYear()); // Update calendar after loading holidays

        })
        .catch(error => {
            error.textContent = "Napaka pri branju dadoteke!";
        });
});




function updateOutput(month, year) {
    const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
    const days = getDaysInMonth(year, month);

    let displayMonth = document.getElementById("displayMonth");
    displayMonth.innerHTML = '';


    displayMonth.appendChild(createTableHeader());
    let newRow = document.createElement("tr");
    var index = 1



    for (let i = 1; i <= days; i++) {
        const d = new Date(year, month - 1, i);
        var day = d.getDay()
        while (index < day) {
            let emptyCell = document.createElement("td");
            emptyCell.textContent = "";
            newRow.appendChild(emptyCell);
            index++;
        }


        if (day == 0) {
            while (index < 7) {
                let emptyCell = document.createElement("td");
                emptyCell.textContent = "";
                newRow.appendChild(emptyCell);
                index++;
            }
        }

        let newCell = document.createElement("td");
        newCell.textContent = i;
        newRow.appendChild(newCell);

        if (day == 0)
            newCell.classList.add("sundayCell")

        if (checkHoliday(d)) {
            console.log('applying');
            newCell.classList.add("holidayCell")


        }
        console.log(checkHoliday(d));

        if (index % 7 === 0) {
            displayMonth.appendChild(newRow);
            newRow = document.createElement("tr");
            index = 1
        }
        else
            index++

    }
    displayMonth.appendChild(newRow);


}


function createTableHeader() {
    let headerRow = document.createElement("tr");

    let dayAbbreviations = ["P", "T", "S", "Č", "P", "S", "N"];

    dayAbbreviations.forEach(abbrev => {
        let newHeader = document.createElement("th");
        newHeader.textContent = abbrev;
        headerRow.appendChild(newHeader);
    });

    return headerRow;
}


function checkHoliday(d) {
    var isHoliday = false;
    try {
        holidays.forEach(holiday => {
            var holidaySplit = holiday.split("/");
            if (holidaySplit.length === 2) { // For dates without year (day/month)
                let holidayDay = Number(holidaySplit[0].trim());
                let holidayMonth = Number(holidaySplit[1].trim());
                if (d.getDate() === holidayDay && (d.getMonth() + 1) === holidayMonth) {
                    isHoliday = true;
                }
            } else if (holidaySplit.length === 3) { // For dates with year (day/month/year)
                let holidayDay = Number(holidaySplit[0].trim());
                let holidayMonth = Number(holidaySplit[1].trim());
                let holidayYear = Number(holidaySplit[2].trim());
                if (d.getDate() === holidayDay && (d.getMonth() + 1) === holidayMonth && d.getFullYear() === holidayYear) {
                    isHoliday = true;
                }
            }
        });
    } catch (error) {
        console.log( error);
        error.textContent = "Interna napaka!";
    }
    return isHoliday;
}



