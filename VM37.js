      var user_balance = 0.00001450;
			var MIN_BET_AMOUNT = 0.000001;
			var MAX_BET_AMOUNT = 1;
			var MIN_MINES = 1;
			var MAX_MINES = 24;
			var TOTAL_TILES = 25;
			var MAGIC_NUMBER = 0.97;
			var my_bet_data = null;
			var tile_opening = 0;
			
			//mines auto
			var auto_betting_status = 'stopped';
			var bet_mode = 'manual';
			var selected_auto_tiles = [];
			//mines auto
			
			function show_my_bets() {
				$('#show_all_bets').removeClass('li_active');
				$('#show_my_bets').addClass('li_active');
				$('#my_bets_table').show();
				$('#all_bets_table').hide();
				load_my_bet_data();
			}
			
			function load_my_bet_data() {
				$.ajax({
					url: "

",
					type: "POST",
					data: "data=my_bet_data",
					error: function(){
						$.toast({
							heading: 'Error!',
							text: 'Request timed out. Please try again!',
							showHideTransition: 'slide',
							position: 'top-right',
							icon: 'error'
						});
					},
					success: function(out){
						obj = JSON.parse(out);
						if(obj.ret == 1) {
							my_bet_data = obj.my_bet_data;
							show_my_bet_data(my_bet_data);
						}
					}
				});
			}
			
			function show_my_bet_data(bet_data) {
				var html = '';
				if(Array.isArray(bet_data)) {
					for(i = 0; i < bet_data.length; i++) {
						html += '<tr>';
						html += '<td>'+bet_data[i].date+'</td>';
						html += '<td>'+bet_data[i].game+'</td>';
						html += '<td>'+bet_data[i].bet_amount+'</td>';
						html += '<td>'+bet_data[i].payout+'</td>';
						html += '<td>'+bet_data[i].profit+'</td>';
						html += '</tr>';
					}
					$('#my_bets_table .bets_table tbody').html(html);
				}
			}
			
			function show_all_bets() {
				$('#show_my_bets').removeClass('li_active');
				$('#show_all_bets').addClass('li_active');
				$('#my_bets_table').hide();
				$('#all_bets_table').show();
				load_all_bet_data();
			}
			
			function load_all_bet_data() {
				$.ajax({
					url: "

",
					type: "POST",
					data: "data=all_bet_data",
					error: function(){
						$.toast({
							heading: 'Error!',
							text: 'Request timed out. Please try again!',
							showHideTransition: 'slide',
							position: 'top-right',
							icon: 'error'
						});
					},
					success: function(out){
						obj = JSON.parse(out);
						if(obj.ret == 1) {
							show_all_bet_data(obj.all_bet_data);
						}
					}
				});
			}
			
			function show_all_bet_data(bet_data) {
				var html = '';
				if(Array.isArray(bet_data)) {
					for(i = 0; i < bet_data.length; i++) {
						html += '<tr>';
						html += '<td>'+bet_data[i].date+'</td>';
						html += '<td>'+bet_data[i].game+'</td>';
						html += '<td>'+bet_data[i].user_name+'</td>';
						html += '<td>'+bet_data[i].bet_amount+'</td>';
						html += '<td>'+bet_data[i].payout+'</td>';
						html += '<td>'+bet_data[i].profit+'</td>';
						html += '</tr>';
					}
					$('#all_bets_table .bets_table tbody').html(html);
				}
			}

			function set_bet_double_amount() {
				if($('#bet_amount').prop("disabled")) {
					return;
				}
				var bet_amount = parseFloat($('#bet_amount').val());
				bet_amount *= 2;
				if(bet_amount > Math.min(MAX_BET_AMOUNT, user_balance)) {
					bet_amount = Math.min(MAX_BET_AMOUNT, user_balance);
				}
				$('#bet_amount').val(bet_amount.toFixed(8));
				calc_profit();
			}
			
			function set_bet_half_amount() {
				if($('#bet_amount').prop("disabled")) {
					return;
				}
				var bet_amount = parseFloat($('#bet_amount').val());
				bet_amount /= 2;
				if(bet_amount < MIN_BET_AMOUNT || isNaN(bet_amount)) {
					bet_amount = MIN_BET_AMOUNT;
				}
				$('#bet_amount').val(bet_amount.toFixed(8));
				calc_profit();
			}
			
			function change_bet_amount() {
				var bet_amount = parseFloat($('#bet_amount').val());
				if(bet_amount < MIN_BET_AMOUNT || isNaN(bet_amount)) {
					bet_amount = MIN_BET_AMOUNT;
				}
				if(bet_amount > Math.min(MAX_BET_AMOUNT, user_balance)) {
					bet_amount = Math.min(MAX_BET_AMOUNT, user_balance);
				}
				setTimeout(function() {
					$('#bet_amount').val(bet_amount.toFixed(8));
					calc_profit();
				}, 100);
			}
			
			function change_num_mines() {
				var num_mines = parseInt($('#num_mines').val());
				var remaining_gems = 0;
				if(num_mines < MIN_MINES || isNaN(num_mines)) {
					num_mines = MIN_BET_AMOUNT;
				}
				if(num_mines > MAX_MINES) {
					num_mines = MAX_MINES;
				}
				remaining_gems = TOTAL_TILES - num_mines;
				setTimeout(function() {
					$('#num_mines').val(num_mines);
					$('#remaining_gems').val(remaining_gems);
					calc_profit();
					//mines auto
					if(num_mines > TOTAL_TILES - selected_auto_tiles.length) {
						selected_auto_tiles = [];
						$('#auto_mine_board .tile .front').removeClass('selected');
					}
					//mines auto
				}, 100);
			}
			
			function process_bet_game_mines() {
				var bet_amount = parseFloat($('#bet_amount').val());
				var num_mines = parseInt($('#num_mines').val());
				$('#bet_amount').prop('disabled', true);
				$('#bet_amount').parent().addClass('disabled');
				//mines auto
				$('#switch_bet_mode').prop('disabled', true); 
				$("#cashout_btn").attr("disabled", true);
				//mines auto
				$('#bet_btn span').hide();
				$('#bet_btn img').show();
				$("#bet_btn").attr("disabled", true);
				$('.game_result_wrap').hide();
				
				setTimeout(function() {
					$.ajax({
												url: "

",
												type: "POST",
						data: "action=bet_game_mines&bet_amount="+bet_amount+"&num_mines="+num_mines,
						error: function(){
							$.toast({
								heading: 'Error!',
								text: 'Request timed out. Please try again!',
								showHideTransition: 'slide',
								position: 'top-right',
								icon: 'error'
							});
							$('#bet_amount').prop('disabled', false);
							$('#bet_amount').parent().removeClass('disabled');
							//mines auto
							$('#switch_bet_mode').prop('disabled', true); 
							$("#cashout_btn").attr("disabled", true);
							//mines auto
							$('#bet_btn img').hide();
							$('#bet_btn span').show();
							$("#bet_btn").attr("disabled", false);
						},
						success: function(out){
							obj = JSON.parse(out);
							if(obj.ret == 0) {
								$.toast({
									heading: 'Error!',
									text: obj.mes,
									showHideTransition: 'slide',
									position: 'top-right',
									icon: 'error'
								});
								$('#bet_amount').prop('disabled', false);
								$('#bet_amount').parent().removeClass('disabled');
								//mines auto
								$('#switch_bet_mode').prop('disabled', true); 
								$("#cashout_btn").attr("disabled", true);
								//mines auto
							} else {
								$("#bet_btn").hide();
								$("#cashout_btn").show();
								$('#num_mines').prop('disabled', true);
								$("#num_mines").parent().addClass('disabled');
								$("#num_mines").parent().find('.nice-select').addClass('disabled');
								//mines auto
								/*$(".game_main .mine_board .tile").removeClass('disabled');
								$(".game_main .mine_board .tile .front").removeClass('focus');
								$(".game_main .mine_board .tile .front").removeClass('hide');
								$(".game_main .mine_board .tile .back").removeClass('revealed');
								$(".game_main .mine_board .tile .back").html('');*/
								$(".game_main #manual_mine_board .tile").removeClass('disabled');
								$(".game_main #manual_mine_board .tile .front").removeClass('focus');
								$(".game_main #manual_mine_board .tile .front").removeClass('hide');
								$(".game_main #manual_mine_board .tile .back").removeClass('revealed');
								$(".game_main #manual_mine_board .tile .back").html('');
								//mines auto
								$('.user_balance').text(parseFloat(parseInt(obj.balance) / 100000000).toFixed(8));
								user_balance = parseFloat((parseInt(obj.balance)) / 100000000).toFixed(8);
							}
							$('#bet_btn img').hide();
							$('#bet_btn span').show();
							$("#bet_btn").attr("disabled", false);							
						}
					});
				}, 100);
			}
			
			//mines auto
			//function process_select_tile_game_mines() {
			function process_select_manual_tile_game_mines() {
			//mines auto
				if(tile_opening == 1) {
					return;
				}
				if($(this).parent().hasClass('disabled')) {
					//mines auto
					/*$.toast({
						heading: 'Error!',
						text: 'Please click bet first!',
						showHideTransition: 'slide',
						position: 'top-right',
						icon: 'error'
					});*/
					//mines auto
				} else {
					var front = $(this);
					var back = $(this).parent().find('.back');
					var tile_id =  $(this).attr('tile_id');
					tile_opening = 1;
					front.addClass('focus');
					setTimeout(function() {
						$.ajax({
														url: "

",
														type: "POST",
							data: "action=select_tile_game_mines&tile_id="+tile_id,
							error: function(){
								$.toast({
									heading: 'Error!',
									text: 'Request timed out. Please try again!',
									showHideTransition: 'slide',
									position: 'top-right',
									icon: 'error'
								});
								tile_opening = 0;
							},
							success: function(out){
								obj = JSON.parse(out);
								if(obj.ret == 0) {
									$.toast({
										heading: 'Error!',
										text: obj.mes,
										showHideTransition: 'slide',
										position: 'top-right',
										icon: 'error'
									});
									tile_opening = 0;
								} else {
									front.removeClass('focus');
									front.addClass('hide');
									if(obj.type == 'gem') {
										var remaining_gems = parseInt($('#remaining_gems').val());
										$('#remaining_gems').val(remaining_gems-1);
										calc_profit();
										back.html('<img src="

" class="show">');
										var mines = obj.mines;
										if(mines != '') {
											for(i = 0; i < TOTAL_TILES; i++) {
												//mines auto
												/*if($('#tile_'+i+' .back').html() == '') {
													$('#tile_'+i+' .back').parent().find('.front').addClass('hide');
													$('#tile_'+i+' .back').addClass('revealed');
													if(mines.includes(i)) {
														$('#tile_'+i+' .back').html('<img src="

" class="show">');
													} else {
														$('#tile_'+i+' .back').html('<img src="

" class="show">');
													}
												}*/
												if($('#manual_tile_'+i+' .back').html() == '') {
													$('#manual_tile_'+i+' .back').parent().find('.front').addClass('hide');
													$('#manual_tile_'+i+' .back').addClass('revealed');
													if(mines.includes(i)) {
														$('#manual_tile_'+i+' .back').html('<img src="

" class="show">');
													} else {
														$('#manual_tile_'+i+' .back').html('<img src="

" class="show">');
													}
												}
												//mines auto
												
											}
											$('.user_balance').text(parseFloat(parseInt(obj.balance) / 100000000).toFixed(8));
											user_balance = parseFloat((parseInt(obj.balance)) / 100000000).toFixed(8);
											$("#bet_btn").show();
											$("#cashout_btn").hide();
											$("#num_mines").attr('disabled', false);
											$("#num_mines").parent().removeClass('disabled');
											$("#num_mines").parent().find('.nice-select').removeClass('disabled');
											change_num_mines();
											calc_profit();
											if(Array.isArray(my_bet_data) && my_bet_data.length > 20) {
												my_bet_data.pop();
											}
											if(Array.isArray(my_bet_data)) {
												my_bet_data.unshift(obj.bet_data);
											} else {
												my_bet_data = [obj.bet_data];
											}
											show_my_bet_data(my_bet_data);
											$('#bet_amount').prop('disabled', false);
											$('#bet_amount').parent().removeClass('disabled');
											$('#switch_bet_mode').prop('disabled', false); //mines auto
											
											$('.game_result_wrap').show();
											$('.game_result_wrap').addClass('win');
											$('.game_result_wrap .multiplier').text(obj.multiplier);
											$('.game_result_wrap .win_amount').text(parseFloat((parseInt(obj.win_amount)) / 100000000).toFixed(8));
										}
									} else {
										back.html('<img src="

" class="show">');
										var mines = obj.mines;
										for(i = 0; i < TOTAL_TILES; i++) {
											//mines auto
											/*if($('#tile_'+i+' .back').html() == '') {
												$('#tile_'+i+' .back').parent().find('.front').addClass('hide');
												$('#tile_'+i+' .back').addClass('revealed');
												if(mines.includes(i)) {
													$('#tile_'+i+' .back').html('<img src="

" class="show">');
												} else {
													$('#tile_'+i+' .back').html('<img src="

" class="show">');
												}
											}*/
											if($('#manual_tile_'+i+' .back').html() == '') {
												$('#manual_tile_'+i+' .back').parent().find('.front').addClass('hide');
												$('#manual_tile_'+i+' .back').addClass('revealed');
												if(mines.includes(i)) {
													$('#manual_tile_'+i+' .back').html('<img src="

" class="show">');
												} else {
													$('#manual_tile_'+i+' .back').html('<img src="

" class="show">');
												}
											}
											//mines auto
										}
										$('.user_balance').text(parseFloat(parseInt(obj.balance) / 100000000).toFixed(8));
										user_balance = parseFloat((parseInt(obj.balance)) / 100000000).toFixed(8);
										$("#bet_btn").show();
										$("#cashout_btn").hide();
										$("#num_mines").attr('disabled', false);
										$("#num_mines").parent().removeClass('disabled');
										$("#num_mines").parent().find('.nice-select').removeClass('disabled');
										change_num_mines();
										calc_profit();
										if(Array.isArray(my_bet_data) && my_bet_data.length > 20) {
											my_bet_data.pop();
										}
										if(Array.isArray(my_bet_data)) {
											my_bet_data.unshift(obj.bet_data);
										} else {
											my_bet_data = [obj.bet_data];
										}
										show_my_bet_data(my_bet_data);
										$('#bet_amount').prop('disabled', false);
										$('#bet_amount').parent().removeClass('disabled');
										$('#switch_bet_mode').prop('disabled', false); //mines auto
									}
									tile_opening = 0;
									$("#cashout_btn").attr("disabled", false); //mines auto
								}
							}
						});			
					}, 200);
				}
			}
			
			//mines auto
			function process_select_auto_tile_game_mines() {
				var front = $(this);
				var back = $(this).parent().find('.back');
				var tile_id =  $(this).attr('tile_id');
				var num_mines = parseInt($('#num_mines').val());
				if(!selected_auto_tiles.includes(tile_id)) {
					if(num_mines < 25 - selected_auto_tiles.length) {
						front.addClass('selected');
						selected_auto_tiles.push(tile_id);
					}
				} else {
					front.removeClass('selected');
					selected_auto_tiles = selected_auto_tiles.filter(e => e !== tile_id)
				}
				if(selected_auto_tiles.length > 0) {
					$("#start_autobet").attr("disabled", false);
				} else {
					$("#start_autobet").attr("disabled", true);
				}
			}
			
			function process_autobet_game_mines() {
				var bet_amount = parseFloat($('#bet_amount').val());
				var num_mines = parseInt($('#num_mines').val());
				$('.game_result_wrap').hide();
				
				setTimeout(function() {
					$.ajax({
												url: "

",
												type: "POST",
						data: "action=autobet_game_mines&bet_amount="+bet_amount+"&num_mines="+num_mines+"&selected_auto_tiles="+selected_auto_tiles,
						error: function(){
							$.toast({
								heading: 'Error!',
								text: 'Request timed out. Please try again!',
								showHideTransition: 'slide',
								position: 'top-right',
								icon: 'error'
							});
							$('#stop_autobet').hide();
							$('#start_autobet').show();
							$('#bet_amount').prop('disabled', false);
							$('#bet_amount').parent().removeClass('disabled');
							$('#num_mines').prop('disabled', false);
							$("#num_mines").parent().removeClass('disabled');
							$("#num_mines").parent().find('.nice-select').removeClass('disabled');
							$('#switch_bet_mode').prop('disabled', false);
							auto_betting_status = 'stopped';
						},
						success: function(out){
							obj = JSON.parse(out);
							if(obj.ret == 0) {
								$.toast({
									heading: 'Error!',
									text: obj.mes,
									showHideTransition: 'slide',
									position: 'top-right',
									icon: 'error'
								});
								$('#stop_autobet').hide();
								$('#start_autobet').show();
								$('#bet_amount').prop('disabled', false);
								$('#bet_amount').parent().removeClass('disabled');
								$('#num_mines').prop('disabled', false);
								$("#num_mines").parent().removeClass('disabled');
								$("#num_mines").parent().find('.nice-select').removeClass('disabled');
								$('#switch_bet_mode').prop('disabled', false);
								auto_betting_status = 'stopped';
							} else {
								var mines = obj.mines;
								var tiles = obj.tiles;
								for(i = 0; i < TOTAL_TILES; i++) {
									if(!tiles.includes(i)) {
										$('#auto_tile_'+i+' .back').addClass('revealed');
									} else {
										$('#auto_tile_'+i+' .back').addClass('selected');
									}
									$('#auto_tile_'+i+' .back').parent().find('.front').addClass('hide');
									if(mines.includes(i)) {
										$('#auto_tile_'+i+' .back').html('<img src="

" class="show">');
									} else {
										$('#auto_tile_'+i+' .back').html('<img src="

" class="show">');
									}
								}
								$('.user_balance').text(parseFloat(parseInt(obj.balance) / 100000000).toFixed(8));
								user_balance = parseFloat((parseInt(obj.balance)) / 100000000).toFixed(8);
								if(Array.isArray(my_bet_data) && my_bet_data.length > 20) {
									my_bet_data.pop();
								}
								if(Array.isArray(my_bet_data)) {
									my_bet_data.unshift(obj.bet_data);
								} else {
									my_bet_data = [obj.bet_data];
								}
								show_my_bet_data(my_bet_data);
								
								if(obj.win_amount > 0) {
									$('.game_result_wrap').show();
									$('.game_result_wrap').addClass('win');
									$('.game_result_wrap .multiplier').text(obj.multiplier);
									$('.game_result_wrap .win_amount').text(parseFloat((parseInt(obj.win_amount)) / 100000000).toFixed(8));
								}
								
								if(bet_mode == 'auto' && auto_betting_status == 'running') {
									setTimeout(function(){
										process_autobet_game_mines();
									}, 1000);
								} else {
									setTimeout(function(){
										for(i = 0; i < TOTAL_TILES; i++) {
											$('#auto_mine_board .tile .front').removeClass('hide');
											$('#auto_mine_board .tile .back').html();
											$('#auto_mine_board .tile .back').removeClass('selected');
										}
									}, 1500);
								}
							}					
						}
					});
				}, 100);
			}
			function start_auto_bet() {
				$('#start_autobet').hide();
				$('#stop_autobet').show();
				$('#bet_amount').prop('disabled', true);
				$('#bet_amount').parent().addClass('disabled');
				$('#num_mines').prop('disabled', true);
				$("#num_mines").parent().addClass('disabled');
				$("#num_mines").parent().find('.nice-select').addClass('disabled');
				$('#switch_bet_mode').prop('disabled', true);
				auto_betting_status = 'running';
				process_autobet_game_mines();
			}
			
			function stop_auto_bet() {
				$('#stop_autobet').hide();
				$('#start_autobet').show();
				$('#bet_amount').prop('disabled', false);
				$('#bet_amount').parent().removeClass('disabled');
				$('#num_mines').prop('disabled', false);
				$("#num_mines").parent().removeClass('disabled');
				$("#num_mines").parent().find('.nice-select').removeClass('disabled');
				$('#switch_bet_mode').prop('disabled', false);
				auto_betting_status = 'stopped';
			}
			//mines auto
			
			function process_cashout_game_mines() {
				$('#cashout_btn span').hide();
				$('#cashout_btn img').show();
				$("#cashout_btn").attr("disabled", true);
				setTimeout(function() {
					$.ajax({
												url: "
",
												type: "POST",
						data: "action=cashout_game_mines",
						error: function(){
							$.toast({
								heading: 'Error!',
								text: 'Request timed out. Please try again!',
								showHideTransition: 'slide',
								position: 'top-right',
								icon: 'error'
							});
							$('#cashout_btn img').hide();
							$('#cashout_btn span').show();
							$("#cashout_btn").attr("disabled", false);						
						},
						success: function(out){
							obj = JSON.parse(out);
							if(obj.ret == 0) {
								$.toast({
									heading: 'Error!',
									text: obj.mes,
									showHideTransition: 'slide',
									position: 'top-right',
									icon: 'error'
								});
							} else {
								/*$.toast({
									heading: 'Success!',
									text: obj.mes,
									showHideTransition: 'slide',
									position: 'top-right',
									icon: 'success'
								});*/
								var mines = obj.mines;
								for(i = 0; i < TOTAL_TILES; i++) {
									//mines auto
									/*if($('#tile_'+i+' .back').html() == '') {
										$('#tile_'+i+' .back').parent().find('.front').addClass('hide');
										$('#tile_'+i+' .back').addClass('revealed');
										if(mines.includes(i)) {
											$('#tile_'+i+' .back').html('<img src="

" class="show">');
										} else {
											$('#tile_'+i+' .back').html('<img src="


" class="show">');
										}
									}*/
									if($('#manual_tile_'+i+' .back').html() == '') {
										$('#manual_tile_'+i+' .back').parent().find('.front').addClass('hide');
										$('#manual_tile_'+i+' .back').addClass('revealed');
										if(mines.includes(i)) {
											$('#manual_tile_'+i+' .back').html('<img src="

" class="show">');
										} else {
											$('#manual_tile_'+i+' .back').html('<img src="

" class="show">');
										}
									}
									//mines auto
								}
								$('.user_balance').text(parseFloat(parseInt(obj.balance) / 100000000).toFixed(8));
								user_balance = parseFloat((parseInt(obj.balance)) / 100000000).toFixed(8);
								$("#bet_btn").show();
								$("#cashout_btn").hide();
								$("#num_mines").attr('disabled', false);
								$("#num_mines").parent().removeClass('disabled');
								$("#num_mines").parent().find('.nice-select').removeClass('disabled');
								change_num_mines();
								calc_profit();
								if(Array.isArray(my_bet_data) && my_bet_data.length > 20) {
									my_bet_data.pop();
								}
								if(Array.isArray(my_bet_data)) {
									my_bet_data.unshift(obj.bet_data);
								} else {
									my_bet_data = [obj.bet_data];
								}
								show_my_bet_data(my_bet_data);
								$('#bet_amount').prop('disabled', false);
								$('#bet_amount').parent().removeClass('disabled');
								$('#switch_bet_mode').prop('disabled', false); //mines auto
								
								$('.game_result_wrap').show();
								$('.game_result_wrap').addClass('win');
								$('.game_result_wrap .multiplier').text(obj.multiplier);
								$('.game_result_wrap .win_amount').text(parseFloat((parseInt(obj.win_amount)) / 100000000).toFixed(8));
								
							}
							$('#cashout_btn img').hide();
							$('#cashout_btn span').show();
							$("#cashout_btn").attr("disabled", false);
						}
					});			
				}, 100);
			}
			
			
			function calc_profit() {
				var num_mines = parseInt($('#num_mines').val());
				var total_gems = TOTAL_TILES - num_mines;
				var remaining_gems = parseInt($('#remaining_gems').val());
				var picked_gems = total_gems - remaining_gems;
				var current_payout = 1;
				//var next_tile_payout = parseFloat(MAGIC_NUMBER * TOTAL_TILES / total_gems).toFixed(2);
				var next_tile_payout = parseFloat(MAGIC_NUMBER * TOTAL_TILES / total_gems);
				var current_profit = 0;
				var next_tile_profit = 0;
				var bet_amount = parseFloat($('#bet_amount').val());
				var i = 0;
				for(i = 0; i < picked_gems; i++) {
					current_payout = next_tile_payout;	
					next_tile_payout = parseFloat(next_tile_payout * parseFloat(MAGIC_NUMBER * (TOTAL_TILES - i) / (total_gems - i)));
				}
				current_payout = parseFloat(current_payout).toFixed(2);
				next_tile_payout = parseFloat(next_tile_payout).toFixed(2);
				
				//current_payout = parseFloat(parseInt(current_payout * 100) / 100).toFixed(2);
				//next_tile_payout = parseFloat(parseInt(next_tile_payout * 100) / 100).toFixed(2);
				
				current_profit = parseFloat((current_payout - 1) * bet_amount).toFixed(8);
				next_tile_profit = parseFloat((next_tile_payout - 1) * bet_amount).toFixed(8);
				$('#next_tile_profit_label').html('Profit On Next Tile ('+next_tile_payout+'×)');
				$('#total_profit_label').html('Total Profit ('+current_payout+'×)');
				$('#total_profit').val(current_profit);
				$('#next_tile_profit').val(next_tile_profit);
			}
			
			//mines auto
			function switch_bet_mode() {
				if(bet_mode == 'manual') {
					$('#auto_bet').show();
					$('#start_autobet').show();
					$('#manual_bet').hide();
					$('#auto_mine_board').show();
					$('#manual_mine_board').hide();
					bet_mode = 'auto';
				} else {
					for(i = 0; i < TOTAL_TILES; i++) {
						$('#manual_mine_board .tile .front').removeClass('hide');
						$('#manual_mine_board .tile .back').html();
						$('#manual_mine_board .tile .back').removeClass('selected');
					}
					$('#auto_bet').hide();
					$('#manual_bet').show();
					$('#manual_mine_board').show();
					$('#auto_mine_board').hide();
					bet_mode = 'manual';
				}
				$('.game_result_wrap').hide();
			}
			//mines auto
			
			$(document).ready(function() {
				load_my_bet_data();
				load_all_bet_data();
				$("#switch_bet_mode").on("change", switch_bet_mode); //mines auto
				$("#bet_double").on("click", set_bet_double_amount);
				$("#bet_half").on("click", set_bet_half_amount);
				$("#bet_amount").on("change", change_bet_amount);
				$("#num_mines").on("change", change_num_mines);
				$("#bet_btn").on("click", process_bet_game_mines);
				//mines auto
				//$(".mine_board .tile .front").on("click", process_select_tile_game_mines);
				$("#manual_mine_board .tile .front").on("click", process_select_manual_tile_game_mines);
				$("#auto_mine_board .tile .front").on("click", process_select_auto_tile_game_mines);
				$("#start_autobet").on("click", start_auto_bet);
				$("#stop_autobet").on("click", stop_auto_bet);
				//mines auto
				$("#cashout_btn").on("click", process_cashout_game_mines);
				calc_profit();
				$('#show_my_bets').on('click', show_my_bets);
				$('#show_all_bets').on('click', show_all_bets);
			});
