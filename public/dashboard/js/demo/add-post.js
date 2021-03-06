
userRule = rule || 'editor' 
var selectedCategory = []
var selectedTag = []
var showAutoComplete = false
function showSelectTag(event){
  let inp = document.querySelector("#myInput")
  if(inp.value){
    showAutoComplete = false
  }
  if(!inp.value && !showAutoComplete){
    console.log('call')
    showAutoComplete = true
    var a = document.createElement("DIV");
    a.setAttribute("id", "myInputautocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    inp.parentNode.appendChild(a);
    var arr = tags
    for (i = 0; i < arr.length; i++) {
        b = document.createElement("DIV");
        b.innerHTML += arr[i].name;
        b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";
        b.addEventListener("click", function(e) {
            inp.value = this.getElementsByTagName("input")[0].value;
            $("#myInputautocomplete-list").remove()
        });
        a.appendChild(b);
    }
  }
}
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].name.toLowerCase().indexOf(val.toLowerCase()) > -1 ) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML += arr[i].name;
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

function addTag(){
  let newTag = $("#myInput").val()
  if(newTag){
    if(selectedTag.length > 0 && selectedTag.findIndex(tag=> tag.name == newTag) > -1)
       return alertify.error('Tag was added!');
    let index = tags.findIndex(tag => tag.name == newTag)
    if(index > -1){
      selectedTag.push(tags[index])
    } else{
      selectedTag.push({
        name: newTag,
        isNew: true
      })
    }
    $("#myInput").val("")
    $(".tagchecklist").append(`
      <span class="d-flex ml-2 mt-2" value="tag-${newTag}">
        <div class="remove-tag-btn" onclick="removeTag('${newTag}')"><i class="fa fa-times" aria-hidden="true" style="cursor: pointer;"></i></div> ${newTag}
      </span>
    `)
  }
  console.log(newTag, selectedTag)
}
function removeTag(name){
  let index = selectedTag.findIndex(tag=> tag.name == name)
  if(index > -1){
    selectedTag.splice(index,1)
    $(`span[value='tag-${name}']`).remove()
  }
  console.log(name,selectedTag)
}
function addCategory(){
  let newCategory = $("#newcategory").val()
  let data = {}
  if(newCategory){
    if(selectedCategory.length > 0 && selectedCategory.findIndex(category=> category.name == newCategory) > -1)
      {
        return alertify.error('Category was added!');
      }
    let index = categories.findIndex(category => category.name == newCategory)
    if(index > -1){
      data = categories[index]
      selectedCategory.push(data)
      $(`#${data.id}`).prop('checked', true);
    } else{

      data = {
        _id: newCategory.replace(/ /g, "_"),
        name: newCategory,
        isNew: true
      }
      selectedCategory.push(data)
      categories.push(data)
      $(".list-categories").append(`
        <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" id="${data._id}" checked>
        <label class="custom-control-label" for="${data._id}">${data.name}</label>
      </div>
      `)
      $('input[type=checkbox]').last().click(function(){
        addEvent.bind(this)()
      })

    }
    $("#myInput").val("")
  }
  console.log(newCategory, selectedCategory)
}
function addEvent(){
    if($(this).is(':checked')) {
      let index = categories.findIndex(el=> el._id == $(this).attr('id') )
      selectedCategory.push(categories[index])
    } else {
      let index = selectedCategory.findIndex(el => el._id == $(this).attr('id'))
      if(index > -1) selectedCategory.splice(index,1)
    }
    console.log('selectedCategory',selectedCategory)
}
function insertImage(){
  $('#uploadImageModal').modal('hide')
  if($("#urlImageInput").val()){
    $('#features-image').attr('src', $("#urlImageInput").val())
    $('#features-image-box').removeClass("hidden")
    $('#features-image-upload').addClass("hidden")
  }
}
function readURL(input) {
  $('#uploadImageModal').modal('hide')
  $("#spinner").removeClass("hidden")
  $('#features-image-upload').addClass("hidden")
  getUrlImage(input).then(url => {
    console.log('url',url)
      $('#features-image').attr('src', url)
      $("#spinner").addClass("hidden")
      $('#features-image-box').removeClass("hidden")
      
  }).catch(err=>{
    console.log('err',err)
    $("#spinner").addClass("hidden")
    $('#features-image-box').removeClass("hidden")
    alertify.error('Upload image failed!');
  })
}

function removeImage() {
  
  $('#features-image-box').addClass("hidden")
  $('#features-image-upload').removeClass("hidden")
  $('#features-image')
  .attr('src', null)
}

function addPost(){
  if(!$("#title-post").val())  return alertify.error('Vui l??ng nh???p ti??u ?????!');
  if(!$("#short-description").val())  return alertify.error('Vui l??ng nh???p m?? t??? ng???n!');
  if(!$(".note-editable").html())  return alertify.error('Vui l??ng nh???p n???i dung b??i vi???t!');
  if(!selectedCategory || selectedCategory.length == 0)  return alertify.error('Vui l??ng ch???n ??t nh???t 1 danh m???c!');
  const data = {
    name : $("#title-post").val(),
    short_description: $("#short-description").val(),
    content: $(".note-editable").html(),
    categories: JSON.stringify(selectedCategory),
    tags: JSON.stringify(selectedTag) ,
    thumb:   $('#features-image').attr('src'),
    isPremium: document.querySelector("#isPremium").checked,
  }
  console.log('data',data)
  $('#text-add').addClass("hidden")
  $('#spinner-add').removeClass("hidden")
  let posting = $.ajax({
    url: `${window.location.origin}/api/post`,
    type: 'POST',
    data: data,
     success: function(msg){
        console.log('res',msg);
        $('#spinner-add').addClass("hidden")
         $('#text-add').removeClass("hidden")
        alertify.success('Success!');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        $('#spinner-add').addClass("hidden")
         $('#text-add').removeClass("hidden")
         alertify.error('Cannot add post!');
      }
  });
}

$(document).ready(function() { 
  $('.checkbox-category').click(function(){
    addEvent.bind(this)()
  })
  
  $('#editor').summernote({height: 500});
  if(tags){
    autocomplete(document.getElementById("myInput"), tags);
  }
  addEvent()

  document.addEventListener('click', ()=>{
    let inp = document.querySelector("#myInput")
    if(!inp.value && showAutoComplete){
      console.log('close')
      showAutoComplete = false
      $("#myInputautocomplete-list").remove()
    }
  })
  $("#myInput").click(function(event){
    event.preventDefault();event.stopPropagation();
    showSelectTag()
   });
})