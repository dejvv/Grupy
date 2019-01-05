function addGroup () {
    requestAddGroup();
    console.log("[addGroup]", window.location.pathname);
    //alert("add group");
}

function requestAddGroup() {
    try {
        $.post(window.location.pathname + "/add",
            {
                created_by_user_id: 4,
                group_description: "req.body.group_description",
                group_photo: "req.body.group_photo",
                hosted_by_user_id: 4,
                group_name: "req.body.group_name",
                group_num_of_people: 100,
                photos: "photos",
                group_place_to_stay: "req.body.group_place_to_stay",
                group_place_to_visit: "req.body.group_place_to_visit"
            },
            function(data, status){
                console.log(data, status);
            }
        );
    } catch (error) {
        console.log(error);
    }
}