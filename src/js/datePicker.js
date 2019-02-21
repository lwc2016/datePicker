(function(window, $) {
    var DatePicker = function(option) {
        this.dateData = [];
        this.element = option.element;
        this.onSelected = option.onSelected;
        this.$inputElement = $(this.element);
        this.$inputElement.attr("readonly", "true");
    };
    // 初始化
    DatePicker.prototype.init = function() {
        //获取当前月份数据
        this.getMonthData();
		this.createElement();
        this.render();
        this.changeMonth();
        this.selectDate();
        this.OpenDatePicker();
        this.close();
    };
    // 获取input元素位置
    DatePicker.prototype.getInputPosition = function(){
        console.log(this.$inputElement.position());
		var left = this.$inputElement.offset().left;
		var top = this.$inputElement.offset().top;
		var width = this.$inputElement.width();
		var height = this.$inputElement.height();
		var _left = left + width - 240;
		if(_left <= 0){
			_left = left;
		}else{
			_left += 5;
		}
		console.log("left: ", left);
		console.log("top: ", top);
		var _top = top + height + 10;
        this.$container.css({left: left + "px", top: _top + "px"});
    };
    DatePicker.prototype.OpenDatePicker = function(){
        var _this = this;
		this.$inputElement.click(function(e){
            e.stopPropagation();
            _this.$container.show();
		});
    };
    // 创建结构
    DatePicker.prototype.createElement = function() {
        var datePickerElement = "<div class='ui-datepicker-header'>" +
            '<a href="" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a>' +
            '<span class="ui-datepicker-current-month">2018-04</span>' +
            '<a href="" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>' +
            '</div>' +
            '<div class="ui-datapicker-body">' +
            '<table>' +
            '<thead>' +
            '<tr>' +
            '<th>日</th>' +
            '<th>一</th>' +
            '<th>二</th>' +
            '<th>三</th>' +
            '<th>四</th>' +
            '<th>五</th>' +
            '<th>六</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '</tbody>' +
            '</table>' +
            '</div>';
        var $datePicker = $(datePickerElement);
        this.$container = $("<div class='ui-datepicker-wrapper'></div>");
        this.$container.append($datePicker);
        $("body").append(this.$container);
        this.getInputPosition();
    };
    // 获取指定年月的数据
    DatePicker.prototype.getMonthData = function(year, month) {
        var result = [];
        if (!year || !month) {
            var today = new Date();
            year = today.getFullYear();
            month = today.getMonth() + 1;
        };

        //获取当月的第一天
        var firstDay = new Date(year, month - 1, 1);
        //获取当月第一天是周几
        var firstDayWeekDay = firstDay.getDay();

        //获取上一个月的最后一天
        var lastDayOfLastMonth = new Date(year, month - 1, 0);
        //获取上一个月的最后一天是几号
        var lastDateOfLastMonth = lastDayOfLastMonth.getDate();

        //上一个月需要显示几天
        var preMonthDayCount = firstDayWeekDay;

        //获取当月最后一天的日期对象
        var lastDay = new Date(year, month, 0);
        //获取当月最后一天的日期
        var lastDateOfLastDay = lastDay.getDate();
        //获取当月最后一天是周几
        var lastDayWeekDay = lastDay.getDay();

        //下一个月需要显示几天
        var nextMonthDayCount = 6 - lastDayWeekDay;

        //遍历上月最后几天
        for (var i = preMonthDayCount - 1; i >= 0; i--) {
            result.push({
                date: 0 - i,
                month: month,
                showDate: lastDateOfLastMonth - i
            });
        };

        //遍历本月日历
        for (var i = 1; i <= lastDateOfLastDay; i++) {
            result.push({
                date: i,
                month: month,
                showDate: i
            });
        };

        //遍历下个月前几天
        for (var i = 1; i <= nextMonthDayCount; i++) {
            result.push({
                date: i,
                month: month + 1,
                showDate: i
            });
        };

        this.dateData = {
			year: year,
			month: month,
			list: result
        };
    };

    // 渲染
    DatePicker.prototype.render = function() {
        var dateData = this.dateData;
        console.log(dateData);
        var html = "";
        for (var i = 0; i < dateData.list.length; i++) {
            if (i % 7 == 0) {
                html += "<tr>";
            }
            if(dateData.list[i].date <= 0 || dateData.list[i].month != dateData.month){
				html += "<td class='grey' data-date=" + dateData.list[i].date + " data-month=" + dateData.list[i].month + ">" + dateData.list[i].showDate + "</td>";
            }else{
				html += "<td data-date=" + dateData.list[i].date + " data-month=" + dateData.list[i].month + ">" + dateData.list[i].showDate + "</td>";
            }

            if (i % 7 == 6) {
                html += "</tr>";
            }
        };
        var tbody = $(html);

		var current_date = this.dateData.year  + "-" + (this.dateData.month < 10? "0" + this.dateData.month : this.dateData.month) ;
		$(".ui-datepicker-wrapper .ui-datepicker-current-month").text(current_date);
        $(".ui-datepicker-wrapper .ui-datapicker-body tbody").empty().append(tbody);
    };
    // 监听点击事件
    DatePicker.prototype.changeMonth = function(){
    	var _this = this;
		$(".ui-datepicker-wrapper .ui-datepicker-prev-btn").click(function(e){
			e.preventDefault();
			var year = _this.dateData.year;
			var month = _this.dateData.month - 1;

			if(month <= 0){
				year = year - 1;
				month = 12;
			};
			_this.getMonthData(year, month);
			_this.render();
		});
		$(".ui-datepicker-wrapper .ui-datepicker-next-btn").click(function(e){
			e.preventDefault();
			console.log("good");
			var year = _this.dateData.year;
			var month = _this.dateData.month + 1;
			if(month >= 13){
				year += 1;
				month = 1;
			};
			_this.getMonthData(year, month);
			_this.render();
		});
    };
	// 选择日期
	DatePicker.prototype.selectDate = function(){
		var _this = this;
		$(".ui-datepicker-wrapper .ui-datapicker-body tbody").click(function(e){
			var target = e.target;
			var date = target.dataset.date;
			var month = target.dataset.month;
			var year = _this.dateData.year;
			var newDate = new Date(year, month - 1, date);

			var _year = newDate.getFullYear();
			var _month = newDate.getMonth() + 1;
			_month = _month < 10 ? "0" + _month: _month;
			var _date = newDate.getDate();
			_date = _date < 10 ? "0" + _date : _date;

			_this.$inputElement.val(_year + "-" + _month + "-" + _date);
			_this.$container.hide();
            _this.onSelected && _this.onSelected(_year + "-" + _month + "-" + _date);
		});
	};
    // 关闭弹窗
    DatePicker.prototype.close = function(){
        var _this = this;
        $("html").click(function(e){
            e.stopPropagation();
            _this.$container.hide();
        });
    };
    window.DatePicker = DatePicker;
})(window, $);

