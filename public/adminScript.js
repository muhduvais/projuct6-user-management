// $(document).ready(function(){
// 	$('[data-toggle="tooltip"]').tooltip();
// 	var actions = $("table td:last-child").html();
// });



$(document).ready(function() {

	if (typeof showModal !== 'undefined' && showModal) {
		$('#addUserModal').modal('show');
	}
});


//Search Function
$(document).ready(function(){
    $("#searchInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();

        $("table tbody tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});



