const submit = document.getElementById('submit');
const form = document.getElementById('myForm');

// const patternMinMaxLength = /^.{5,12}$/;
// const patternNumeric = /^\d+$/;
// const patternAlphabetsOnly = /^[a-z]+$/i;
// const patternEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validItems = [
  {id: 'userId', isValid: false},
  {id: 'password', isValid: false},
  {id: 'name', isValid: false},
  {id: 'country', isValid: false},
  {id: 'zipCode', isValid: false},
  {id: 'email', isValid: false},
  {id: 'sex', isValid: false},
  {id: 'language', isValid: false},
];

// console.log(validItems[2].id)


class UI {
  static userInput(id, pattern, msg) {
    document.getElementById(id).addEventListener('input',Message.debounce((e)=> {
      let value = e.target.value;
      Validation.isPatternValid(id, value, pattern) ? Message.render(`Input is correct`, 'success', 'check', id)
                      : Message.render(msg,'danger','x', id);          
    })); 
  }

  static userSelectCountry(id, defaultValue, value, msg) {
    Validation.isValidCountry(id, defaultValue, value) ? Message.render(`Input is correct`, 'success', 'check', id)
                      : Message.render(msg,'danger','x', id);
  }

  static userSelectSex(id, msg) {
    Validation.isValidSex(id);
    const radio = document.querySelectorAll(`input[type="radio"]`);
    radio.forEach((item)=>{
      item.id === id ? item.checked = true : item.checked = false;
    });
  }

  static userSelectLanguage(id, msg) {
    Validation.isValidLanguage(id);
    const checkbox = document.querySelectorAll(`input[type="checkbox"]`);
    checkbox.forEach((item)=>{
      item.id === id ? item.checked = true : item.checked = false;
    });
  }

  static submitFunc(e) {
    e.preventDefault();
    validItems.every((item, index, arr) => {
      if (!item.isValid) {
        alert(`Please fill up valid input (into the required input field): ${item.id}`);
        return false;
      } 
      
      if(!item.isValid && arr.length - 1 === index) {
        alert("thank you. this form will be saved");
      }

      return true;
    });
  }

  static formFunction(e) {
    const id = e.target.id;
    let pattern;
    let errorMessage;
    
    switch (id) {
      case 'userId':
        pattern = /^.{5,12}$/; //minimum of 5 maximum of 12 character
        errorMessage = `Please input minimum of 5 and maximum of 12 characters`;
        UI.userInput(id, pattern, errorMessage);
        break;
      case 'password':
        pattern = /^.{7,12}$/; //minimum of 7 maximum of 12 character
        errorMessage = `Please input minimum of 7 and maximum of 12 characters`;
        UI.userInput(id, pattern, errorMessage);
        break;
      case 'name':
        pattern = /^[a-z]+$/i; //alphabets only
        errorMessage = `Please input alphabets only`;
        UI.userInput(id, pattern, errorMessage);
        break;
      case 'country':
        const defaultValue = '(Please select a country)';
        const selectedValue = e.target.value;
        errorMessage = 'Please select valid country';
        UI.userSelectCountry(id, defaultValue, selectedValue, errorMessage);
        break;
      case 'zipCode':
        pattern = /^\d+$/; //numeric only
        errorMessage = `Please input numeric only`;
        UI.userInput(id, pattern, errorMessage);
        break;
      case 'email':
        pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //email pattern
        errorMessage = `Please input a valid email address`;
        UI.userInput(id, pattern, errorMessage);
        break;
      case 'male':
      case 'female':
        errorMessage = 'Please check valid sex'; 
        UI.userSelectSex(id, errorMessage);
        break;
      case 'english':
      case 'nonEnglish':
        errorMessage = 'Please check valid language'; 
        UI.userSelectLanguage(id, errorMessage);
        break;      
      default:
        break;
    }
  }
  
}

class Validation {
  //validation using REg Exp 
  static isPatternValid(id, string, pattern){
      pattern.test(string) && this.isvalid(id);
      return pattern.test(string);
  }

  //checking if not defualt value selected
  static isValidCountry(id, defaultValue, value) {
    defaultValue !== value && this.isvalid(id)
    return (defaultValue !== value)
  }

  static isValidSex(id) {
    (id === 'male' || id === 'female') && this.isvalid('sex')
    return (id === 'Male' || id === 'Female')
  }

  static isValidLanguage(id) {
    (id === 'english' || id === 'nonEnglish') && this.isvalid('language')
    return (id === 'english' || id === 'nonEnglish')
  }

  static isvalid(id) {
    validItems.forEach((item) => {
      if(item.id === id){
        item.isValid = true;
      }
    });
  }
}

class Message {

  //Debounce user input before showing message
  static debounce(func, timeout = 800){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    }
  }

  //rendering messages to DOM
  static render(msg, color, icon, id) {
    const input = document.getElementById(id);
    
    //deleting the div tag if already excess else do nothing
    try {     
     document.querySelector(`div [name=${id}]`).remove();    
    }catch (err) {
      // console.log(err);
    }

    //creating the message and rendering to DOM
    const msgDiv = document.createElement('div');
    msgDiv.setAttribute('name', id)
    msgDiv.innerHTML = `
                <div class="text-${color}" style="font-size: 0.8rem">
                  <i class="bi bi-${icon}-circle-fill"></i>
                  <span>${msg}</span>
                </div>`;
    input.parentElement.appendChild(msgDiv);

    //if success message remove after 3 seconds
    setTimeout(()=> {
          if(color === 'success') {
            msgDiv.remove();
          }          
        }, 3000);      
  }
}

//Event Handler
submit.addEventListener('click', UI.submitFunc);
form.addEventListener('click', UI.formFunction );