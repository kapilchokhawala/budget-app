// BUDGET CONTROLLER
var budgetController = (function() {
    
   var Expense  = function(id, description, value) {
       this.id = id
       this.description = description
       this.value = value
       this.percentage = -1
    }

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        }
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage
    }

   var Income  = function(id, description, value) {
       this.id = id
       this.description = description
       this.value = value
    }

    var calculateTotal = function(type) {
        var sum = 0
        data.allItems[type].forEach(currElem => sum += currElem.value)
        data.totals[type] = sum
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function(type, description, value) {
            var newItem, ID

            // create new id
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else if(
                ID = 0
            )

            console.log(`ID: ${ID}`)
            // create new item based on 'inc' or 'exp' type
            if(type === 'exp') {
                newItem = new Expense(ID, description, value)
            } else if(type === 'inc') {
                newItem = new Income(ID, description, value)
            }

            // push in to the data structure
            data.allItems[type].push(newItem)

            // return the new element
            return newItem
        },
        deleteItem: function(type, id) {
            console.log('data.allItems[type]')
            console.log(data.allItems[type])
            var ids, index
            ids = data.allItems[type].map(function(current) {
                return current.id
            })
            console.log(`ids`)
            console.log(ids)
            index = ids.indexOf(id)
            console.log(`id`)
            console.log(id)

            console.log(`index: ${index}`)

            if(index !== -1) {
                console.log('if')
                data.allItems[type].splice(index, 1)
            }
            console.log('data.allItems[type]')
            console.log(data.allItems[type])
        },
        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('inc')
            calculateTotal('exp')

            console.log('data.totals.inc')
            console.log(data.totals.inc)
            console.log('data.totals.exp')
            console.log(data.totals.exp)
            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp

            // calculate the percentage of income that we spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            } else {
                data.percentage = -1
            }

        },
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(curr) {
                curr.calcPercentage(data.totals.inc)
            })
        },
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(curr) {
                return curr.getPercentage()
            })
            return  allPerc
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function() {
            console.log(data)
        }
    }

})()

// UI CONROLLER
var UIController = (function() {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    var formatNumber = function(num, type) {
        var numSplit, int, dec
        /**
         *  + or - before number
         *  exactly 2 decimal points
         *  comma separating the thousands
         */

        num = Math.abs(num)
        num = num.toFixed(2)

        numSplit = num.split('.')

        int = numSplit[0]
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3)
        }

        dec = numSplit[1]

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec

    }

    var nodeListForEach = function(list, callback) {
        for(var i = 0; i < list.length; i++) {
            callback(list[i], i)
        }
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: +document.querySelector(DOMStrings.inputValue).value
            }
        },
        addListItem: function(obj, type) {
            var html, newHTML, element

            // Create HTML String with place holder text
            if(type === 'inc') {
                element = DOMStrings.incomeContainer
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if(type === 'exp') {
                element = DOMStrings.expensesContainer
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // Replace placee holder text
            newHTML = html.replace('%id%', obj.id)
            newHTML = newHTML.replace('%description%', obj.description)
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type))

            // Insert the HTML in the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML)
        },
        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID)
            el.parentNode.removeChild(el)
        },
        clearFields: function() {
            var fields, fieldsArray

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue)
            fieldsArray = Array.prototype.slice.call(fields)

            fieldsArray.forEach(elem => (elem.value = ""));
            fieldsArray[0].focus()
        },
        displayBudget: function(obj) {
            type = obj.budget > 0 ? 'inc' : 'exp'
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type)
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc')
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp')
            
            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%'
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---'
            }
        },
        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel)

            nodeListForEach(fields, function(current, index) {

                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%'   
                } else {
                    current.textContent = '---'
                }
            })
        },
        displayMonth: function(){
            var now, year
            
            now = new Date()

            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            month = months[now.getMonth()]

            year = now.getFullYear()

            document.querySelector(DOMStrings.dateLabel).textContent = `${month} ${year}`
        },
        changedType: function() {
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' + 
                DOMStrings.inputDescription + ',' + 
                DOMStrings.inputValue)

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus')
            })

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red')
        },
        getDOMStrings: function() {
            return DOMStrings   
        }
    }

})()

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOMStrings = UICtrl.getDOMStrings()

        document.querySelector(DOMStrings.inputBtn).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem()
            }
        })

        document.querySelector(DOMStrings.container).addEventListener('click', ctrlDeleteItem)

        document.querySelector(DOMStrings.inputType).addEventListener('change', UICtrl.changedType)
    }

    var updateBudget = function() {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget()

        // 2. Return the budget
        var budget = budgetCtrl.getBudget()

        // 3. Display the newly calculated budget on the UI
        UICtrl.displayBudget(budget)

    }

    var updatePercentages = function() {

        // 1. Calculate the percentages
        budgetCtrl.calculatePercentages()

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages()

        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages)

    }

    var ctrlAddItem = function() {
        var input, newItem

        // 1. Get the field input data
        input = UICtrl.getInput()

        if(input.description !== '' && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)

            // 3. Add the new item to the UI
            UICtrl.addListItem(newItem, input.type)

            // 4. Clear the fields
            UICtrl.clearFields()

            // 5. Calculate and update budget
            updateBudget()

            // 6. Calculate and update percentages
            updatePercentages()

        }
        
    }

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

        console.log(`itemID: ${itemID}`)
        if(itemID) {
            splitID = itemID.split('-')
            type = splitID[0]
            ID = +splitID[1]
        }

        console.log(`type: ${type}`)
        console.log(`ID: ${ID}`)
        // 1. Delete the item from the data structure
        budgetCtrl.deleteItem(type, ID)

        // 2. Delete the item from the UI
        UICtrl.deleteListItem(itemID)

        // 3. Update and show the new budget
        updateBudget()

    }

    return {
        init: function() {
            console.log('The Application has started !!')
            UICtrl.displayMonth()
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
            setupEventListeners()
        }
    }
   

})(budgetController, UIController)

controller.init()