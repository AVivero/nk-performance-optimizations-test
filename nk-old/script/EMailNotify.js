function AddToYourCityList(pSourceID, pTargetID) 
{
    var lSource = document.getElementById(pSourceID);
    var lTarget = document.getElementById(pTargetID);
    var lTargetCount = 0;
    var lAlreadyInTarget = false;
    
    lTargetCount = lTarget.length;
    
    for(lIndex = 0; lIndex < lTargetCount; lIndex++)
    {
        if(lTarget.options[lIndex].text == lSource.options[lSource.selectedIndex].text)
        {
            lAlreadyInTarget = true;
            break;
        }
    }
    
    if(!lAlreadyInTarget)
    {
        lTarget.options[lTargetCount]= new Option();
        lTarget.options[lTargetCount].text = lSource.options[lSource.selectedIndex].text;
        lTarget.options[lTargetCount].value = lSource.options[lSource.selectedIndex].value;
        
//        var input = document.createElement("input");
//        input.setAttribute("type", "hidden");
//        input.setAttribute("name", "SelectedAirport_" + lSource.options[lSource.selectedIndex].value);
//        input.setAttribute("value",  lSource.options[lSource.selectedIndex].value);

//        document.forms[0].appendChild(input);
        
    }
}

function RemoveFromYourCityList(pTargetID) 
{
    var lTarget = document.getElementById(pTargetID);
    var lElementCount = document.forms[0].elements.length;
    var lName = "SelectedAirport_" + lTarget.options[lTarget.selectedIndex].value;
    
    lTarget.options[lTarget.selectedIndex] = null;
    
    for(lIndex = 0; lIndex < lElementCount; lIndex++)
    {
        if(document.forms[0].elements[lIndex].name == lName)
        {
            document.forms[0].removeChild(document.forms[0].elements[lIndex]);
            break;
        }
    }
}

function AddToHiddenField(pSourceID, pTargetID)
{
    var lSource = document.getElementById(pSourceID);
    var lTarget = document.getElementById(pTargetID);
    var lSourceCount = 0;
    var lTargetCount = 0;

    lSourceCount = lSource.length;
    lTargetCount = lTarget.length;
    
    for(lTargetIndex = 0; lTargetIndex < lTargetCount; lTargetIndex++)
    {
        for(lSourceIndex = 0; lSourceIndex < lSourceCount; lSourceIndex++)
        {
            if(lSource.options[lSourceIndex].text == lTarget.options[lTargetIndex].text)
            {
                var input = document.createElement("input");
                input.setAttribute("type", "hidden");
                input.setAttribute("name", "SelectedAirport_" + lSource.options[lSourceIndex].value);
                input.setAttribute("value",  lSource.options[lSourceIndex].value);
                document.forms[0].appendChild(input);
                break;
            }
        }
    }



//    var lFirstName = document.getElementById("EMailNotifySignupEMailNotifyControl_txtFirstName"); //"EMailNotifySignupEMailNotifyControl_txtFirstName")
    
//    with (lFirstName)
//    {
//        if (value==null||value=="")
//        {
//            alert("Please enter your first name.");
//        }
//    }
    //var lLastName = document.getElementById(pLastNme);    
    //var lAlertMessage = "";
//    alert("I am in ValidateRequired"); //pPageName);
//    alert(pFirstName);
//    alert(pLastName);
//    return false;
}
