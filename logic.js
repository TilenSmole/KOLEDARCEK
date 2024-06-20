var holidays = []
//ob zagonu strani prebere datoteko s praznikami
document.addEventListener('DOMContentLoaded', function () {
    fetch('holidays.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Napaka na omrežju ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            holidays = data.split('\n')
            updateOutput(new Date().getMonth() + 1, new Date().getFullYear()); //posodobi koledar, ker se to naloži po že naložitvi koledarja

        })
        .catch(error => {
            error.textContent = "Napaka pri branju dadoteke!";
        });
});



//funkcija naloži datume za izbrani mesec in leto
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
        if (checkHoliday(d))
            newCell.classList.add("holidayCell")

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

//funkcija ustvari header v tabeli
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

//funkcija preverja, ali je dani dan slučajno praznik
function checkHoliday(d) {
    var isHoliday = false;
    try {
        holidays.forEach(holiday => {
            var holidaySplit = holiday.split("/");
            let holidayDay = Number(holidaySplit[0].trim());
            let holidayMonth = Number(holidaySplit[1].trim());
            if (holidaySplit.length === 2) { //za praznike, ki se ne ponavljajo
                if (d.getDate() === holidayDay && (d.getMonth() + 1) === holidayMonth) 
                    isHoliday = true;
                
            } else if (holidaySplit.length === 3) {  //za praznike, ki se  ponavljajo
                let holidayYear = Number(holidaySplit[2].trim());
                if (d.getDate() === holidayDay && (d.getMonth() + 1) === holidayMonth && d.getFullYear() === holidayYear) 
                    isHoliday = true;
                
            }
        });
    } catch (error) {
        error.textContent = "Interna napaka!";
    }
    return isHoliday;
}



