$(document).ready(function() {
	//On load mark things that are not default
	$(".defset").each(function(){
		var current = $(this).data('for');
		var defval = $(this).data('defval');
		var itype = $(this).data('type');
		switch(itype){
			case 'bool':
				if(defval == 1){
					if(!$('#'+current+"true").is(':checked')){
						$(this).removeClass('hidden');	
					}
				}else{
					if($('#'+current+"true").is(':checked')){
						$(this).removeClass('hidden');	
					}
				}
			break;
			case 'int':
			case 'text':
			case 'textarea':
			case 'select':
				if($('#'+current).val() != defval){
					$(this).removeClass('hidden');
				}  
			break;
		}
	});
	//Act on read only
	if($("#AS_DISPLAY_READONLY_SETTINGSfalse").is(':checked')){
		$(".setro").each(function(){
			$(this).addClass("hidden");
		});
	}else{
		$(".setro").each(function(){
			$(this).removeClass("hidden");
		});		
	}
	if($("#AS_OVERRIDE_READONLYfalse").is(':checked')){
		$(".setro").each(function(){
			$(this).attr('readonly',true);
		});
	}else{
		$(".setro").each(function(){
			$(this).attr('readonly',false);
		});		
	}
	//Act on hidden
	if($("#AS_DISPLAY_HIDDEN_SETTINGSfalse").is(':checked')){
		$(".sethidden").each(function(){
			$(this).addClass("hidden");
		});
	}else{
		$(".sethidden").each(function(){
			$(this).removeClass("hidden");
		});		
	}
});
//visibility/ro updates
$("input[name='AS_DISPLAY_READONLY_SETTINGS']").change(function(){
	if($(this).val()){
		$(".setro").each(function(){
			$(this).attr('readonly',false);
		});
	}else{
		$(".setro").each(function(){
			$(this).attr('readonly',true);
		});
	}
});
$("input[name='AS_DISPLAY_HIDDEN_SETTINGS']").change(function(){
	if($(this).val()){
		$(".sethidden").each(function(){
			$(this).removeClass("hidden");
		});
	}else{
		$(".sethidden").each(function(){
			$(this).addClass("hidden");
		});
	}
});
$("input[name='AS_OVERRIDE_READONLY']").change(function(){
	if($(this).val()){
		$(".setro").each(function(){
			$(this).removeClass("hidden");
		});
	}else{
		$(".setro").each(function(){
			$(this).addClass("hidden");	
		});
	}
});

//Reset to default icon
$(".defset").click(function(e){
	e.preventDefault();
	var current = $(this).data('for');
	var defval = $(this).data('defval');
	var itype = $(this).data('type');
	switch(itype){
		case 'bool':
			console.log(defval);
			if(defval){
				$('#'+current+"true").prop('checked', true);
				$('#'+current+"false").prop('checked', false);
				$(this).addClass('hidden');
			}else{
				$('#'+current+"true").prop('checked', false);
				$('#'+current+"false").prop('checked', true);
				$(this).addClass('hidden');			
			}
		break;
		case 'int':
		case 'text':
		case 'textarea':
		case 'select':
			$('#'+current).val(defval);
			$(this).addClass('hidden');
		break;
	}
});

//Show the revert icon when changing input to a non-default state.
$(':input').change(function(){
	var itype = $(this).attr('type');
	switch(itype){
		case 'radio':
			var vid = $(this).attr('name');
			var vval = $("input[name="+vid+"]:checked").val();
			var dval = $("#"+vid+"default").val();
			if((vval == 'true' && dval == 1)||(vval == 'false' && dval == 0)){
				$("a[data-for='"+vid+"']").addClass('hidden');
			}else{
				$("a[data-for='"+vid+"']").removeClass('hidden');
			}
		
		break;
		case 'number':
		case 'text':
		case 'textarea':
			var vid = $(this).attr('name');
			if($('#'+vid).val() == $('#'+vid+'default').val()){
				$("a[data-for='"+vid+"']").addClass('hidden');
			}else{
				$("a[data-for='"+vid+"']").removeClass('hidden');
			}
		break;
	}
});
//Show the revert icon when changing select to a non-default state.
$('select').on('change', function() {
	var sid = $(this).attr('name');
	if($('#'+sid+'default').val() == $(this).val()){
		$("a[data-for='"+sid+"']").addClass('hidden');
	}else{
		$("a[data-for='"+sid+"']").removeClass('hidden');
	}
});
//Show the revert icon when changing ttextarea to a non-default state.
$('textarea').on('change', function() {
	var tid = $(this).attr('name');
	if($('#'+tid+'default').val() == $(this).val()){
		$("a[data-for='"+tid+"']").addClass('hidden');
	}else{
		$("a[data-for='"+tid+"']").removeClass('hidden');
	}
});
