var IntervalID;

var Profiles = {};

Profiles.A = {
	Value: 0,
	Icon: ".farm_icon_a"
}

Profiles.B = {
	Value: 1,
	Icon: ".farm_icon_b"
}

chrome.storage.sync.get(["Profile", "Delay"], function(Items)
{
	/*
	*	If an item is not set or an error occured,
	*	the Storage API returns an undefined value.
	*	In that case use the default value and alert
	*	the user.
	*/
	if (Items.Profile == null || Items.Delay == null)
	{
		window.alert("Unable to retrieve settings.\nDefault values will be used.");
		Items.Profile = "Auto"
		Items.Delay = 225;
	}
	
	if (Items.Profile == "Auto")
	{
		var Tables = document.querySelectorAll("#content_value > div.vis > div > form tbody");
		var CapacityA = Tables[Profiles.A.Value].lastElementChild.lastElementChild.innerHTML;
		var CapacityB = Tables[Profiles.B.Value].lastElementChild.lastElementChild.innerHTML;
		
		if (CapacityA > CapacityB)
			IntervalID = window.setInterval(ClickAuto, Items.Delay, Profiles.A, Profiles.B);
		else
			IntervalID = window.setInterval(ClickAuto, Items.Delay, Profiles.B, Profiles.A);
	}
	else
	{
		IntervalID = window.setInterval(ClickSelected, Items.Delay, Profiles[Items.Profile]);
	}
});

var VillageList = document.getElementById("plunder_list").firstElementChild.children;

function GetUnitsHome()
{
	var UnitsList = document.getElementsByClassName("unit-item");
	var Output = {};
	
	for (var i = 0; i < UnitsList.length; ++i)
	{
		Output[UnitsList[i].id] = window.parseInt(UnitsList[i].innerHTML);
	}
	
	return Output;
}

function HasSufficientUnits(Profile)
{
	var UnitsHome = GetUnitsHome();
	
	for (var Unit in UnitsHome)
	{
		if (window.parseInt(document.querySelectorAll("[name=" + Unit + "]")
			.item(Profile.Value).getAttribute("value")) > UnitsHome[Unit])
			return false;
	}
	
	return true;
}


function ClickSelected(Profile)
{
	if (VillageList.length > 1 && HasSufficientUnits(Profile))
		VillageList[1].querySelector(Profile.Icon).click();
	else
		window.clearInterval(IntervalID);
}

function ClickAuto(Max, Min)
{
	if (VillageList.length > 1)
	{
		if (VillageList[1].getElementsByTagName("img")[2].src.endsWith("1.png") && HasSufficientUnits(Max))
			VillageList[1].querySelector(Max.Icon).click();
		else if (HasSufficientUnits(Min))
			VillageList[1].querySelector(Min.Icon).click();
		else
			window.clearInterval(IntervalID);
	}
	else
		window.clearInterval(IntervalID);
}