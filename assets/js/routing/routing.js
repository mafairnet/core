$(function() {
	$('#outbound_routes').sortable({
		containerSelector: 'tbody',
		itemPath: 'tbody',
		itemSelector: 'tr',
		placeholder: '<tr class="placeholder"/>',
		handle: '.fa-arrows',
		update: function(event, ui){
			var id = ui.item.data('id');
			var seq = ui.item.index()+1;
			$.ajax({
				type: 'POST',
				url: location.href,
				data: 'action=ajaxroutepos&quietmode=1&skip_astman=1&restrictmods=core&repotrunkkey='+id+'&repotrunkdirection='+seq,
				dataType: 'json',
				success: function(data) {
					toggle_reload_button('show');
				}
			});
		}
	});
	$('#routetrunks').sortable({
		containerSelector: 'tbody',
		itemPath: 'tbody',
		itemSelector: 'tr',
		placeholder: '<tr class="placeholder"/>',
		handle: '.fa-arrows',
		update: function(event, ui){
			var cur = 0;
			var seq = [];
			$("[id^='trunkpri']").each(function(){
				var trunk = $(this).val();
				if(trunk === ''){return;}
				seq.push(trunk);
			});
			$.ajax({
				type: 'POST',
				url: location.href,
				data: {
					action:"updatetrunks",
					quietmode:"1",
					skip_astman:"1",
					restrictmods: "core",
					trunkpriority:seq,
					extdisplay:$("#extdisplay").val()
					},
				dataType: 'json',
				success: function(data) {
					toggle_reload_button('show');
				}
			});
		}
	});
});

$("a[id^='del']").click(function(){
	var id = $(this).data('id');
	$.ajax({
		type: 'POST',
		url: location.href,
		data: 'action=delroute&quietmode=1&skip_astman=1&json=true&restrictmods=core&id='+id,
		dataType: 'json',
		success: function(data) {
			toggle_reload_button('show');
			location.reload();
		}
	});
});
$("a[id^='routerowadd']").on('click',function(){
	var curRow = $("tr[id^='dprow']").last();
	var id = $("tr[id^='dprow']").length++;
	var newhtml = '';
	newhtml +='<tr id="dprow'+id+'">';
	newhtml +=	'<td>';
	newhtml +=	'	<div class="input-group">';
	newhtml +=	'		<span class="input-group-addon" id="basic-addon'+(id+10)+'">(</span>';
	newhtml +=	'		<input placeholder="prepend" type="text" id="prepend_digit_'+id+'" name="prepend_digit[]" class="form-control " value="">';
	newhtml +=	'		<span class="input-group-addon" id="basic-addon'+(id+11)+'">)</span>';
	newhtml +=	'	</div>';
	newhtml +=	'</td>';
	newhtml +=	'<td>';
	newhtml +=	'	<div class="input-group">';
	newhtml +=	'		<input placeholder="prefix" type="text" id="pattern_prefix_'+id+'" name="pattern_prefix[]" class="form-control " value=""> ';
	newhtml +=	'		<span class="input-group-addon" id="basic-addon'+(id+12)+'">|</span>';
	newhtml +=	'	</div>';
	newhtml +=	'</td>';
	newhtml +=	'<td>';
	newhtml +=	'	<div class="input-group">';
	newhtml +=	'		<span class="input-group-addon" id="basic-addon'+(id+13)+'">[</span>';
	newhtml +=	'		<input placeholder="match pattern" type="text" id="pattern_pass_'+id+'" name="pattern_pass[]" class="form-control dpt-value" value="">';
	newhtml +=	'		<span class="input-group-addon" id="basic-addon'+(id+14)+'">/</span>';
	newhtml +=	'	</div>';
	newhtml +=	'</td>';
	newhtml +=	'<td>';
	newhtml +=	'	<div class="input-group">';
	newhtml +=	'		<input placeholder="CallerID" type="text" id="match_cid_'+id+'" name="match_cid[]" class="form-control " value="">';
	newhtml +=	'		<span class="input-group-addon" id="basic-addon'+(id+15)+'">]</span>';
	newhtml +=	'	</div>';
	newhtml +=	'</td><td>';
	newhtml +=	'		<a href="#" id="routerowadd'+id+'"><i class="fa fa-plus"></i></a>';
	newhtml +=	'		<a href="#" id="routerowdel'+id+'"><i class="fa fa-trash"></i></a>';
	newhtml +=	'</td>';
	newhtml +=	'</tr>';
	curRow.parent().append(newhtml);

});

$("a[id^='routerowdel']").click(function(){
	var curRow = $(this).closest('tr');
	curRow.fadeOut(2000, function(){
		$(this).remove();
	});
});

//DialPlan Wizard
$("[id='routinggetlocalprefixes']").click(function(){
	var npa = $('#lpwnpa').val();
	var nxx = $('#lpwnxx').val();
	var patterns = [];
	if ($('#fwdownload').prop('checked')){
		$.ajax({
		type: 'POST',
		url: location.href,
		data: 'action=getnpanxxjson&npa='+npa+'&nxx='+nxx,
		dataType: 'json',
		async:false,
		beforeSend: function(){
			$('#dpwizard').modal('hide');
			$('#dploading').modal('show');
		},
		success: function(data) {
			$.each(data,function(){
				var npa = this.npa;
				var nxx = this.nxx;
				if ($('#fw7').prop('checked')){
					patterns.push(nxx+'XXXX');
				}
				if ($('#fw10').prop('checked')){
					patterns.push(npa+nxx+'XXXX');
				}
				if ($('#fw11').prop('checked')){
					patterns.push('1'+npa+nxx+'XXXX');
				}
			});
		},
		error: function(){
			$('#dploading').html('<h1>Something went wrong with the download</h1>');
		}
	});
	}else{
		if ($('#fw7').prop('checked')){
			patterns.push('NXXXXXX');
		}
		if ($('#fw10').prop('checked')){
			patterns.push('NXXNXXXXXX');
		}
		if ($('#fw11').prop('checked')){
			patterns.push('1NXXNXXXXXX');
		}
	}
	if ($('#fwtollree').prop('checked')){
		//800 since 1966
		patterns.push('1800NXXXXXX');
		//888 since 1996
		patterns.push('1888NXXXXXX');
		//877 since 1998
		patterns.push('1877NXXXXXX');
		//866 Since 2000
		patterns.push('1866NXXXXXX');
		//855 Since 2010
		patterns.push('1855NXXXXXX');
		//844 Since 2013
		patterns.push('1844NXXXXXX');
		//Future not implimented 833,822,880-887,889
	}
	if ($('#fwinfo').prop('checked')){
		//Community Services
		patterns.push('211');
		//Municipal services Non-Emergency
		patterns.push('311');
		//Directory Assistance
		patterns.push('411');
		//Traffic
		patterns.push('511');
		//Telephone company repair
		patterns.push('611');
		//TDD Relay
		patterns.push('711');
	}
	if ($('#fwemergency').prop('checked')){
		patterns.push('911');
	}
	if ($('#fwint').prop('checked')){
		patterns.push('011.');
	}
	if ($('#fwld').prop('checked')){
		patterns.push('1NXXNXXXXXX');
	}
	if($('#dptable').length){
		var idbase = ($("tr[id^='dprow']").length + $('#dptable').length);
		$.each(patterns,function(){
			var lastRow = $("tr[id^='dprow']").last();
			var id = idbase++;
			console.log(idbase);
			var newhtml = '';
			newhtml +='<tr id="dprow'+id+'">';
			newhtml +=	'<td>';
			newhtml +=	'	<div class="input-group">';
			newhtml +=	'		<span class="input-group-addon" id="basic-addon'+(id+10)+'">(</span>';
			newhtml +=	'		<input placeholder="prepend" type="text" id="prepend_digit_'+id+'" name="prepend_digit[]" class="form-control " value="">';
			newhtml +=	'		<span class="input-group-addon" id="basic-addon'+(id+11)+'">)</span>';
			newhtml +=	'	</div>';
			newhtml +=	'</td>';
			newhtml +=	'<td>';
			newhtml +=	'	<div class="input-group">';
			newhtml +=	'		<input placeholder="prefix" type="text" id="pattern_prefix_'+id+'" name="pattern_prefix[]" class="form-control " value=""> ';
			newhtml +=	'		<span class="input-group-addon" id="basic-addon'+(id+12)+'">|</span>';
			newhtml +=	'	</div>';
			newhtml +=	'</td>';
			newhtml +=	'<td>';
			newhtml +=	'	<div class="input-group">';
			newhtml +=	'		<span class="input-group-addon" id="basic-addon'+(id+13)+'">[</span>';
			newhtml +=	'		<input placeholder="match pattern" type="text" id="pattern_pass_'+id+'" name="pattern_pass[]" class="form-control dpt-value" value="'+this+'">';
			newhtml +=	'		<span class="input-group-addon" id="basic-addon'+(id+14)+'">/</span>';
			newhtml +=	'	</div>';
			newhtml +=	'</td>';
			newhtml +=	'<td>';
			newhtml +=	'	<div class="input-group">';
			newhtml +=	'		<input placeholder="CallerID" type="text" id="match_cid_'+id+'" name="match_cid[]" class="form-control " value="">';
			newhtml +=	'		<span class="input-group-addon" id="basic-addon'+(id+15)+'">]</span>';
			newhtml +=	'	</div>';
			newhtml +=	'</td><td>';
			newhtml +=	'		<a href="#" id="routerowadd'+id+'"><i class="fa fa-plus"></i></a>';
			newhtml +=	'		<a href="#" id="routerowdel'+id+'"><i class="fa fa-trash"></i></a>';
			newhtml +=	'</td>';
			newhtml +=	'</tr>';
			lastRow.parent().append(newhtml);
		});
	}
	if($('#bulk_patterns').length){
		$('#bulk_patterns').val(patterns.join("\r\n"));
	}
	$('#dploading').modal('hide');
});
//tab specifics
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	switch(e.target.hash){
		case "#dialpatterns":
			$("#wizmenu").removeClass('hidden');
		break;
		default:
			$("#wizmenu").addClass('hidden');
		break;

	}
});

$("[id^='trunkpri']:last").change(function(){
	var id = /trunkpri([0-9]*)/.exec($(this).attr('id'));
	var nextid = (Number(id[1]) +1);
	if($("[id^='trunkpri']").length == 1){
		return;
	}
	if($(this).val() === ''){
		var curRow = $(this).closest('tr');
		curRow.fadeOut(2000, function(){
			$(this).remove();
		});
	}else{
		var curRow = $(this).closest('tr');
		var newRow = curRow.clone(true);
		$(newRow).attr('id', 'trunkrow'+nextid);
		var newinput = newRow.find("[id^='trunkpri']");
		$(newinput).attr('id', 'trunkpri'+nextid);
		$(newinput).attr('name', 'trunkpri['+nextid+']');
		curRow.after(newRow);
	}

});
$("#duplicate").click(function(){
	$("#action").val("copyroute");
});