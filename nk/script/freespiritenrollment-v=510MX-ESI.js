var EnableSiquisOverlays = 'False',
MemberGetMemberOverlay = 'N';

$(function(){
    $(":input[id*=DropDownListBirthDateYear]").change(DOB_Adjust_Days)  
    $(":input[id*=DropDownListBirthDateMonth]").change(DOB_Adjust_Days)  
})

 
function daysInMonth(iMonth, iYear)
{
	return 32 - new Date(iYear, iMonth, 32).getDate();
}

function DOB_Adjust_Days(object)
{
    DOB_month  = $(":input[id*=DropDownListBirthDateMonth]").val();
    DOB_year  = $(":input[id*=DropDownListBirthDateYear]").val();
    DOB_days = daysInMonth(DOB_month-1,DOB_year);
    DOB_days_length = $(":input[id*=DropDownListBirthDateDay]")[0].length
    if (DOB_days_length > (DOB_days+1))
    {
        for (var i=DOB_days_length; i>DOB_days; i--)
        {
             $(":input[id*=DropDownListBirthDateDay]")[0].remove(i);
        }
    }
    else if (DOB_days_length < (DOB_days+1))
    {
        for (var i=DOB_days_length; i<=DOB_days; i++)
        {
            var elOptNew = document.createElement('option');
            elOptNew.text = i;
            elOptNew.value = i;
            var elSel = $(":input[id*=DropDownListBirthDateDay]")[0];
            try {
                elSel.add(elOptNew, null); // standards compliant; doesn't work in IE
            }
            catch (ex) {

                try {
                    elSel.add(elOptNew); //work in IE only
                }
                catch (e) {
                    var opt = elSel.options;
                    opt[opt.length] = new Option(i, i);
                }
            }
        }
    }
}

function populateMailListData()
{
    var enrollPrefix = "#FreeSpiritEnrollmentGroupControl_FreeSpiritEnrollmentInputControl_";
    var emailPrefix = "#FreeSpiritEnrollmentGroupControl_FreeSpiritEnrollmentEMailNotifyControl_";

    var firstName = $(enrollPrefix + 'TextBoxFirstName').val();
    var lastName = $(enrollPrefix + 'TextBoxLastName').val();
    var email = $(enrollPrefix + 'TextBoxEmailAddress').val();
    var airportHomeDDL = $(enrollPrefix + 'ddHomeAirport');
    var airportSecondaryDDL = $(enrollPrefix + 'ddSecondaryAirport');
     var airportHome = ''
    var airportSecondary = '';


    if (airportHomeDDL.length > 0) {
        airportHome = airportHomeDDL[0].value;
    }
    if (airportSecondaryDDL.length > 0) {
        airportSecondary = airportSecondaryDDL[0].value;
    }
     
    $(emailPrefix + 'txtFirstName').val(firstName);
    $(emailPrefix + 'txtLastName').val(lastName);
    $(emailPrefix + 'txtEmail').val(email);
    $(emailPrefix + 'txtConfirmEmail').val(email);
    $('select#' + emailPrefix + 'ddHomeAirport').val(airportHome);
    $('select#' + emailPrefix + 'ddSecondaryAirport').val(airportSecondary);
    $(emailPrefix + 'chkSpecialOffer').attr('checked', true);
    
    return true;
}

function ValidateDOB()
{
    //debugger;
    var isValid = true;
    var now = new Date();
    var currentMonth = now.getMonth() + 1;
    var currentDay = now.getDate();
    var currentYear = now.getFullYear();
    var dobMonth = $(":input[id$=DropDownListBirthDateMonth]").val();
    var dobDay = $(":input[id$=DropDownListBirthDateDay]").val();
    var dobYear = $(":input[id$=DropDownListBirthDateYear]").val();
    var counter = 0;
    
    if (dobMonth == "") counter++;
    if (dobDay == "") counter++;
    if (dobYear == "") counter++;     
           
    if (counter == 3) 
    {   
        //skip validation
    }
    else if (counter == 0)
    {        
        //validate for today's date    
        if (dobMonth == currentMonth && dobDay == currentDay && dobYear == currentYear)
        {
            isValid = false;
            $("#dateError").show();
            $("#dateError").focus();
        }
        else
        {            
            //validate for future date
            if ((dobYear > currentYear) ||
                ((dobMonth > currentMonth) && dobYear == currentYear) || 
                (dobMonth == currentMonth && dobDay > currentDay && dobYear == currentYear))
            {
                isValid = false;
                $("#dateError").show();
                $("#dateError").focus();
            } 
        }
    } 
    else
    {
        //partial DOB
        isValid = false;
        $("#dateError").show();
        $("#dateError").focus();
    }   
    return isValid;
}


function validateForm(obj) {
    if (EnrollmentValidator.processForm(obj)) {
        populateMailListData();
        _doPostBack('FreeSpiritEnrollmentGroupControl$LinkButtonSubmit', '');
        return true;
    }
    return false;
};

function displayFS_Overlay(culture, FSMCFlag) {
    var overlay = getOverlayCookie('FSOverlayCookie');
    if (MemberGetMemberOverlay == "Y") {
        overlay = getOverlayCookie('MemberGetMemberCookie');
    }
    if (overlay == null || overlay != "1") {
        if (FSMCFlag == "N" || MemberGetMemberOverlay == "Y") {
            var today = new Date();
            var expires = (1000 * 60 * 60 * 24 * 30); 	//30 days = 1000 * 60 * 60 * 24 * 30
            var expDate = new Date(today.getTime() + (expires));
            expDate = expDate.toGMTString();
            if (FSMCFlag == "N") {
                document.cookie = "FSOverlayCookie" + "=" + "1" + "; expires=" + expDate + "; path=/";
            }
            if (MemberGetMemberOverlay == "Y") {
                document.cookie = "MemberGetMemberCookie" + "=" + "1" + "; expires=" + expDate + "; path=/";
            }
            var overlayContainer = document.createElement("div");
            overlayContainer.id = "FS_overlay";
            var overlay = document.createElement("iframe");
            overlay.width = "605";
            overlay.height = "458";
            overlay.src = EnableSiquisOverlays == 'True' ? "http://marketing.spirit.com/overlay/fs/member.php" : "Content/LinkRefHtml/PopUps/" + culture + "/FSOverlay.html";
            if (MemberGetMemberOverlay == "Y") {
                overlay.src = "http://marketing.spirit.com/overlay/fs/getmember.php";
            }
            overlay.frameborder = 0;
            overlay.scrolling = "no";
            var overlayObj = $(overlayContainer).appendTo('body');
            overlayObj.dialog({
                autoOpen: true,
                modal: true,
                show: "fade",
                hide: "fade",
                width: 650,
                resizable: false,
                position: GetDefaultModalPosition(),
                open: function (event, ui) {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#FS_overlay").dialog('close');
                    });
                },
                close: function (event, ui) {
                    $('.ui-widget-overlay').unbind('click');
                }
            });
            overlayContainer.appendChild(overlay);
            $(overlayContainer).css("height", "auto");

            //$('#FS_overlay').html($('#FS_overlay').html());

        }
    }
};

function getOverlayCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
};

function ValidationRequiredOnEnter(e) {
    var e = window.event || e;
    if (e.keyCode == 13) {
        $('#FreeSpiritEnrollmentGroupControl_LinkButtonSubmit').click();
    }
}
function ValidateAccountSection(sender)
 {
     if (AccountInfoValidator.ValidateOnly(sender)) {

         $('#free_spirit_tabs').find('li').eq(0).removeClass('active');
         $('#free_spirit_tabs').find('li').eq(1).addClass('active');
         $('#account-information').addClass('hidden');
         $('#contact-information').removeClass('hidden');
         $('#wto_button').removeClass('hidden');
         $('#nextstep').addClass('hidden');
         return true;
     }
     else {
         AccountInfoValidator.processForm(sender);
         return false;
     }

 };
 function ValidateSignup(sender) 
 {
     var validatesignup = true;
     //validatesignup = ValidateAccountSection(sender);
     if (ValidateAccountSection(sender) &&  ValidateContactSection(sender)) 
     {
          populateMailListData();
          //__doPostBack('FreeSpiritEnrollmentGroupControl$LinkButtonSubmit', '')
          return true;      
     }

     return false;
 }
 function ValidateContactSection(sender) 
 {
     if (ContactInfoValidator.ValidateOnly(sender)) {

         $('#free_spirit_tabs').find('li').eq(1).removeClass('active');
         $('#free_spirit_tabs').find('li').eq(0).addClass('active');
         $('#contact-information').addClass('hidden');
         $('#account-information').removeClass('hidden');
         $('#nextstep').removeClass('hidden');
         $('#wto_button').addClass('hidden');
        
         return true;
     }
     else {
         if (AccountInfoValidator.ValidateOnly(sender)) {
             ContactInfoValidator.processForm(sender);
             return false;
         }
     }
 }

 function populateSelectBoxValue() {
     //populate country and state
     $DDLState = $("#Default_DDLState");
     $DDLCountry = $("#Default_DDLCountry");
     if ($.trim($DDLCountry.val()) != "") {
         $(".countryelement").children("option[value=" + "'" + $.trim($DDLCountry.val()) + "'" + "]").attr("selected", true);
         $(".stateelement").each(function () {
             if ($.trim($DDLCountry.val()) == "US") {
                 $(this).hide();
                 if ($(this).hasClass("state")) {
                     $(this).show();
                     if ($.trim($DDLState.val()) != "") {
                         $(this).children("option[value=" + "'" + $.trim($DDLState.val()) + "'" + "]").attr("selected", true);
                     }
                 }
             } else {
                 $(this).hide();
                 if ($(this).hasClass("text")) {
                     $(this).show();
                     if ($.trim($DDLState.val()) != "") {
                         $(this).val($.trim($DDLState.val()));
                     }
                 }
             }
         });
     }
 }
 function displayPopupWrapper(originater, popup, toRight) {
     $(".popUpWrapper").hide(); // hide any other balloon that might be open in order to show the one being clicked on
     $(".popUpFareWrapper").hide(); // hide any other balloon that might be open in order to show the one being clicked on
     $(".popUpAwardWrapper").hide(); // hide any other balloon that might be open in order to show the one being clicked on

     var prepareBubble = (popup instanceof jQuery) ? popup : $(popup);

     prepareBubble.show();
 }
 $(document).ready(function () {
	 if(currentCulture=='es-PR')
		 $('#ConfirmPasswordLabel').attr('class', 'ConfirmPasswordLabel');
    // tabs click functionality FREE Spirit REdesign
     $('body').on('click', 'a.account_information', function () {

        // allow back ward funcitonality 
        // ValidateContactSection(this);

        $('#free_spirit_tabs').find('li').eq(1).removeClass('active');
        $('#free_spirit_tabs').find('li').eq(0).addClass('active');
        $('#contact-information').addClass('hidden');
        $('#account-information').removeClass('hidden');
        $('#nextstep').removeClass('hidden');
        $('#wto_button').addClass('hidden');
        ContactInfoValidator.clearBubble(this);
    });
     $('body').on('click', 'a.contact_information', function () {

        ValidateAccountSection(this);

     });
     $('.terms_conditions_check').on('click', '.field_chkbx', function () {
        $('div.error_msg_bubble, div.bubble').hide();
    });
    $("#fsetermsconditions").keydown(function (event) {
        if(event.which===13)
            $("#chkbx__CheckBoxTermsConditions").click();
     });
    $('body').on('click', '#TSAPreCheck', function (event) {
        event.preventDefault();  //prevent the default action of the link
        var $this = $(this),
        //     sId = $(this).attr('id'),
        // iIndex = sId.indexOf("_"),
        // id = sId.substr(iIndex + 1, iIndex + 2),
        $popup = '#TSAPreCheck_popup';
        displayPopupWrapper($this, $popup, true);
    });
    $('body').on('click', '#RedrassNumber', function (event) {
        event.preventDefault();  //prevent the default action of the link
        var $this = $(this),
        //     sId = $(this).attr('id'),
        // iIndex = sId.indexOf("_"),
        // id = sId.substr(iIndex + 1, iIndex + 2),
        $popup = '#RedrassNumber_popup';
        displayPopupWrapper($this, $popup, true);
    });
    
});
