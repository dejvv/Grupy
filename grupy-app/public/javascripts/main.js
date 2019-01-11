function addGroup () {
    //$("#send-request").addClass("is-loading");
    
    // let data = getAddGroupData("#create-group-form");
    // dodaj skupino
    // requestAddGroup(data).then(function (result){
    //     console.log("[addGroup] result of promise", result);
    //     $("#send-request").removeClass("is-loading");
    // });
}

// pridobi podatke iz forme
function getAddGroupData(form) {
    let data = getFormData($(form))
    return {
        group_description: data.description,
        group_photo: data.link_photo || "default_photo",
        group_name: data.name,
        group_number_of_people: data.number_of_people | 2,
        group_place_to_stay: "https://nevemo.kje.bomo.hoho",
        group_place_to_visit: data.place_to_visit || "world"
    }
}


// doda skupino
function requestAddGroup(data) {
    return new Promise ( (resolve, reject) => {
        try {
            $.post(window.location.pathname + "/add",
                {
                    created_by_user_id: 4,
                    group_description: data.group_description,
                    group_photo: data.group_photo,
                    hosted_by_user_id: 4,
                    group_name: data.group_name,
                    group_num_of_people: data.group_number_of_people,
                    photos: "photos",
                    group_place_to_stay: data.group_place_to_stay,
                    group_place_to_visit: data.group_place_to_visit
                },
                function(data, status){
                    console.log(data, status);
                    resolve(data);
                }
            );
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

// aktivira modal, id je string
function activateModal(id) {
    $(id).addClass("is-active");
    $("html").addClass("is-clipped");
}

// deaktivira modal, id je string
function deactivateModal(id) {
    $(id).removeClass('is-active');
    $("html").removeClass('is-clipped');
}

// iz forme pobere vse podatke in vrne objekt, form je html element (document.getElementById("my-form"))
function getFormData(form) {
    var rawJson = form.serializeArray();
    var model = {};
    
    $.map(rawJson, function (n, i) {
        model[n['name']] = n['value'];
    });
    
    return model;
}

// ko se naloada window
window.onload = function () {
    // za vse modale
    $(".open-modal").on("click", function(event) {
        /*
        Having a .class selector for Event handler will result in bubbling of 
        click event (sometimes to Parent element, sometimes to Children elements in DOM).
        event.StopPropagation() method ensures that event doesn't bubble to Parent elements, 
        while event.StopImmediatePropagation()method ensures that event doesn't bubble to Children elements of 
        desired class selector.
        */
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.preventDefault();
        activateModal("#get-data-modal");

        $('.modal-background').on('click', function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();
           deactivateModal("#get-data-modal");
        });
        $('.custom-modal-close').on('click', function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();
            deactivateModal("#get-data-modal");
        });
        $('.modal-close').on('click', function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();
            deactivateModal("#get-data-modal");
        });
        $('.delete').on('click', function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();
            deactivateModal("#get-data-modal");
        });
    });

    // event listener za #create-group-button
    $("#create-group-button").on("click", function(event){
        $("#send-request").addClass("is-loading");
        let data = getAddGroupData($("#create-group-form"));
        requestAddGroup(data).then(function (result){
            console.log("[addGroup] result of promise", result);
            $("#send-request").removeClass("is-loading");
        }); 
    });

    var burger = document.querySelector('.burger');
    var menu = document.querySelector('#'+burger.dataset.target);
    burger.addEventListener('click', function() {
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
    });
}