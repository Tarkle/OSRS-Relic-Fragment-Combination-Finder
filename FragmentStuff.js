var Fragments = [];
var Relics = [];
var SelectedRelic;
var RelicDropdown = document.getElementById('RelicDropDown');
var FragmentDropdown = document.getElementById('FragmentFilterDropDown');
var FilterDropDown = document.getElementById('FilterDropDown');
var dropDownItem = document.getElementsByClassName('dropdown-item');
var RelicsOfFragmentsinRows = [];
var ListOfAvailableRelicsPerRow = [];
var ConvertedListOfRelicIDsToNamesPerRow = []; //This is the important one I guess
var FragmentPermutations = [];
var ListOfIndexesFromFilter = [];
var ListOfFilterStrings = [];
var ListOfFilterFragmentStrings = [];
var UniqueFragmentsPerSelection = [];

function OnLoadJS(){
    RelicDropdown = document.getElementById('RelicDropDown');
    FilterDropDown = document.getElementById('FilterDropDown');
    FragmentDropdown = document.getElementById('FragmentFilterDropDown');

    PopulateFragments();
    PopulateRelics();
    MixAndMatch();
    AddClickEventToRelicDropDownMenu();
    AddClickEventToFilterDropDownMenu();
    AddClickEventToFragmentFilterDropDownMenu();
    PopulateRelicDropDown();
    dropDownItem = document.getElementsByClassName('dropdown-item');
    AddClickEventToRelicDropDownItems();
}

function PopulateRelicDropDown(){
    Relics.forEach(element => {
        document.getElementById('RelicDropItems').innerHTML += `<a class="dropdown-item">${element.Name}</a>`;
    });
}

function PopulateFilterDropDown(){
    var UniqueListOfRelics = [];
    document.getElementById('FilterDropItems').innerHTML = '';
    document.getElementById('FilterSelectorName').innerHTML = '';
    for(var i = 0; i < ConvertedListOfRelicIDsToNamesPerRow.length; i++)
    {
        for(var x = 0; x < ConvertedListOfRelicIDsToNamesPerRow[i].length; x++)
        {
            if(UniqueListOfRelics.find(y => y == ConvertedListOfRelicIDsToNamesPerRow[i][x]) == undefined)
            {
                UniqueListOfRelics.push(ConvertedListOfRelicIDsToNamesPerRow[i][x]);
            }
        }
    }

    UniqueListOfRelics.sort();
    for(var i = 0; i < UniqueListOfRelics.length; i++)
    {
        document.getElementById('FilterDropItems').innerHTML += `<a class="dropdown-item">${UniqueListOfRelics[i]}</a>`;
    }
}

function PopulateFragmentFilterDropDown()
{
    var uniqueListOfFragments = [];
    document.getElementById('FragmentFilterDropItems').innerHTML = '';
    document.getElementById('FragmentFilterSelectorName').innerHTML = '';

    for(var i = 0; i < FragmentPermutations.length; i++)
    {
        if(ListOfIndexesFromFilter.find(index => index == i) != undefined)
        {
            for(var x = 0; x < FragmentPermutations[i].length; x++)
            {
                if(uniqueListOfFragments.find(y => y == FragmentPermutations[i][x].Name) == undefined)
                {
                    uniqueListOfFragments.push(FragmentPermutations[i][x].Name);
                }
            }
        }   
    }

    uniqueListOfFragments.sort();
    for(var i = 0; i < uniqueListOfFragments.length; i++)
    {
        document.getElementById('FragmentFilterDropItems').innerHTML += `<a name="FragDropDownItem" class="dropdown-item">${uniqueListOfFragments[i]}</a>`;
    }
}

function AddClickEventToRelicDropDownMenu() {
    FilterDropDown.addEventListener('click', function (event) {
        event.stopPropagation();
        FilterDropDown.classList.toggle('is-active');
    });
}

function AddClickEventToFilterDropDownMenu() {
    RelicDropdown.addEventListener('click', function (event) {
        event.stopPropagation();
        RelicDropdown.classList.toggle('is-active');
    });
}

function AddClickEventToFragmentFilterDropDownMenu() {
    FragmentDropdown.addEventListener('click', function (event) {
        event.stopPropagation();
        FragmentDropdown.classList.toggle('is-active');
    });
}

function AddClickEventToRelicDropDownItems() {
    for (var i = 0; i < dropDownItem.length; i++) {
        dropDownItem[i].addEventListener('click', SetSelectedRelic, false);
    }
}

function AddClickEventToFilterDropDownItems() {
    for (var i = 0; i < dropDownItem.length; i++) {
        dropDownItem[i].addEventListener('click', SetSelectedFilter, false);
    }
}

function AddClickEventToFragmentFilterDropDownItems() {
    let FDropItem = document.getElementsByName("FragDropDownItem");
    for (var i = 0; i < FDropItem.length; i++) {
        FDropItem[i].addEventListener('click', SetSelectedFragmentFilter, false);
    }
}

function SetSelectedRelic(){
    document.getElementById('RelicSelectorName').innerHTML = this.innerHTML;
}

function SetSelectedFilter(){
    document.getElementById('FilterSelectorName').innerHTML = this.innerHTML;
}

function SetSelectedFragmentFilter(){
    document.getElementById('FragmentFilterSelectorName').innerHTML = this.innerHTML;
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

function AddClick(){
    UpdateText(true);
    var Table = document.getElementById('AddedRelicsBody');
    var SelectedRelic = document.getElementById('RelicSelectorName').innerHTML;

    if(document.getElementById('RelicCalcTable').tBodies[0].rows[0] != undefined)
    {
        for(var i = 0; i < document.getElementById('RelicCalcTable').tBodies[0].rows.length; i++)
        {
            if(document.getElementById('RelicCalcTable').tBodies[0].rows[i].cells[1].innerHTML === SelectedRelic)
            {
                return;
            }
        }
    }

    Table.innerHTML += `<tr name="AddedRelicItems">
                    <td style="display:none;" id="RelicID">${Relics.find(x => x.Name === SelectedRelic).ID}</td>
                    <td>${SelectedRelic}</td>
                </tr>`;
}

function ClearClick(){
    UpdateText(false);
    var Table = document.getElementById('AddedRelicsBody');
    let FragTable = document.getElementById('ListOfFragments');
    document.getElementById('FilterDropItems').innerHTML = '';
    document.getElementById('FilterDropItems').value = '';
    ListOfIndexesFromFilter = [];
    document.getElementById('AddedFiltersBody').innerHTML = '';
    ListOfFilterStrings = [];
    ListOfFilterFragmentStrings = [];
    UniqueFragmentsPerSelection = [];
    document.getElementById('FilterSelectorName').value = '';
    document.getElementById('FilterSelectorName').innerHTML = '';
    document.getElementById('FragmentFilterSelectorName').value = '';
    document.getElementById('FragmentFilterSelectorName').innerHTML = '';
    document.getElementById('FragmentAddedFiltersBody').innerHTML = '';

    Table.innerHTML = '';
    FragTable.innerHTML = '';
    document.getElementById("CombinationsPossible").innerHTML = 'Total Combinations Possible:';
}

function RunClick(){
    let AllFragmentsFromRelics;
    FragmentPermutations = [];
    let FragTable = document.getElementById('ListOfFragments');
    FragTable.innerHTML = '';
    RelicsOfFragmentsinRows = [];
    ListOfAvailableRelicsPerRow = [];
    ListOfIndexesFromFilter = [];
    if(document.getElementById('RelicCalcTable').tBodies[0].rows[0] != undefined)
    {
        AllFragmentsFromRelics = GetAllChosenFragments();

        //console.log(Permutations(AllFragmentsFromRelics, document.getElementById('NumberOfFragmentSlots').value));

        //FragmentPermutations = Permutations(AllFragmentsFromRelics, document.getElementById('NumberOfFragmentSlots').value);
        Permutations(AllFragmentsFromRelics, document.getElementById('NumberOfFragmentSlots').value);

        for(var i = 0; i < FragmentPermutations.length; i++)
        {
            RelicsOfFragmentsinRows.push([]);

            for(var x = 0; x < FragmentPermutations[i].length; x++)
            {
                RelicsOfFragmentsinRows[i].push([FragmentPermutations[i][x].RelicOneID, FragmentPermutations[i][x].RelicTwoID]);
            }
        }
        UpdateText(false);
        SetListAvailableRelicsPerRow();
        document.getElementById("CombinationsPossible").innerHTML = `Total Combinations Possible: ${ListOfAvailableRelicsPerRow.length}`;
        PopulateFilterDropDown();
        AddClickEventToFilterDropDownItems();
        PopulateFragmentFilterDropDown();
        AddClickEventToFragmentFilterDropDownItems();
    }
}

let checker = (arr, target) => target.every(v => arr.includes(v));

function LoopChecker(ArrayOfStuff, ArrayOfFilters)
{
    var IncludesFilterWord = true;
    for(var i = 0; i < ArrayOfFilters.length; i++)
    {
        if(ArrayOfStuff.includes(ArrayOfFilters[i]) && IncludesFilterWord == true)
        {     } 
        else
        {
            IncludesFilterWord = false;
        }
    }
    return IncludesFilterWord;
}

function AddFilterClick()
{
    var SelectedFilter = document.getElementById('FilterSelectorName').innerHTML;
    ListOfIndexesFromFilter = [];
    document.getElementById('AddedFiltersBody').innerHTML = '';
    if(ListOfFilterStrings.find(x => x == SelectedFilter) == undefined)
    {
        ListOfFilterStrings.push(SelectedFilter);
    }

    if(ListOfFilterStrings == [])
    {
        for(var i = 0; i < FragmentPermutations.length; i++)
        {
            ListOfIndexesFromFilter.push(i); //Populates all elements
        }

        return;
    }

    //Check if row contains all filtered options
    for(var i = 0; i < ConvertedListOfRelicIDsToNamesPerRow.length; i++)
    {
        if(LoopChecker(ConvertedListOfRelicIDsToNamesPerRow[i], ListOfFilterStrings))//checker(ListOfFilterStrings, ConvertedListOfRelicIDsToNamesPerRow[i]))
        {
            ListOfIndexesFromFilter.push(i);
        }
    }

    if(ListOfFilterFragmentStrings.length > 0)
    {
        ApplyFragmentFilters()
    }

    for(var i = 0; i < ListOfFilterStrings.length; i++)
    {
        DisplayFilterToUI(ListOfFilterStrings[i]);
    }

    document.getElementById("CombinationsPossible").innerHTML = `Total Combinations Possible: ${ListOfIndexesFromFilter.length}`;
}

function AddFragmentFilterClick()
{
    if(ListOfFilterStrings.length > 0)
    {
        AddFilterClick(); //Apply any relic filters first
    }
    //ListOfIndexesFromFilter[] will now be populated
    var SelectedFragmentFilter = document.getElementById('FragmentFilterSelectorName').innerHTML;
    if(ListOfFilterFragmentStrings.find(x => x == SelectedFragmentFilter) == undefined)
    {
        ListOfFilterFragmentStrings.push(SelectedFragmentFilter);
    }

    if(ListOfFilterFragmentStrings == [])
    {
        return;
    }

    if(ListOfIndexesFromFilter == [])
    {
        for(var i = 0; i < FragmentPermutations.length; i++)
        {
            ListOfIndexesFromFilter.push(i); //Populates all elements
        }
    }

    let TempFragmentRowList = [];
    let TempListOfIndexes = [];
    //Check if row contains all filtered options
    for(var i = 0; i < FragmentPermutations.length; i++)
    {
        TempFragmentRowList = [];
        for(var x = 0; x < FragmentPermutations[i].length; x++)
        {
            TempFragmentRowList.push(FragmentPermutations[i][x].Name);
        }
        if(LoopChecker(TempFragmentRowList, ListOfFilterFragmentStrings))//checker(ListOfFilterFragmentStrings, TempFragmentRowList))
        {
            if(ListOfIndexesFromFilter.find(h => h == i) != undefined)
            {
                TempListOfIndexes.push(i); //If the row matches the filter and it exists in the previous filtered list
            }
        }
    }

    for(var i = 0; i < ListOfFilterFragmentStrings.length; i++)
    {
        DisplayFragmentFilterToUI(ListOfFilterFragmentStrings[i]);
    }
    
    ListOfIndexesFromFilter = TempListOfIndexes;
    document.getElementById("CombinationsPossible").innerHTML = `Total Combinations Possible: ${ListOfIndexesFromFilter.length}`;
}

function ApplyFragmentFilters()
{
    if(ListOfFilterFragmentStrings == [])
    {
        return;
    }

    let TempFragmentRowList = [];
    let TempListOfIndexes = [];
    //Check if row contains all filtered options
    for(var i = 0; i < FragmentPermutations.length; i++)
    {
        TempFragmentRowList = [];
        for(var x = 0; x < FragmentPermutations[i].length; x++)
        {
            TempFragmentRowList.push(FragmentPermutations[i][x].Name);
        }
        if(LoopChecker(TempFragmentRowList, ListOfFilterFragmentStrings))//checker(ListOfFilterFragmentStrings, TempFragmentRowList))
        {
            if(ListOfIndexesFromFilter.find(h => h == i) != undefined)
            {
                TempListOfIndexes.push(i); //If the row matches the filter and it exists in the previous filtered list
            }
        }
    }
    
    ListOfIndexesFromFilter = TempListOfIndexes;
    document.getElementById("CombinationsPossible").innerHTML = `Total Combinations Possible: ${ListOfIndexesFromFilter.length}`;
}

function DisplayFilterToUI(_SelectedFilter)
{
    var Table = document.getElementById('AddedFiltersBody');
    var SelectedFilter = _SelectedFilter;

    if(document.getElementById('FiltersSelectedTable').tBodies[0].rows[0] != undefined)
    {
        for(var i = 0; i < document.getElementById('FiltersSelectedTable').tBodies[0].rows.length; i++)
        {
            if(document.getElementById('FiltersSelectedTable').tBodies[0].rows[i].cells[0].innerHTML === SelectedFilter)
            {
                return;
            }
        }
    }

    Table.innerHTML += `<tr name="FiltersItems">
                    <td>${SelectedFilter}</td>
                </tr>`;
}

function DisplayFragmentFilterToUI(_SelectedFilter)
{
    var Table = document.getElementById('FragmentAddedFiltersBody');
    var SelectedFilter = _SelectedFilter;

    if(document.getElementById('FragmentFiltersSelectedTable').tBodies[0].rows[0] != undefined)
    {
        for(var i = 0; i < document.getElementById('FragmentFiltersSelectedTable').tBodies[0].rows.length; i++)
        {
            if(document.getElementById('FragmentFiltersSelectedTable').tBodies[0].rows[i].cells[0].innerHTML === SelectedFilter)
            {
                return;
            }
        }
    }

    Table.innerHTML += `<tr name="FragFiltersItems">
                    <td>${SelectedFilter}</td>
                </tr>`;
}

function DisplayClick()
{
    let FragTable = document.getElementById('ListOfFragments');
    FragTable.innerHTML = '';
    let RowIndex = 0;

    for(var i = 0; i < FragmentPermutations.length; i++)
    {
        if(ListOfIndexesFromFilter.find(index => index == i) != undefined)
        {
            FragTable.insertRow(-1);

            for(var x = 0; x < FragmentPermutations[i].length; x++)
            {
                FragTable.rows[RowIndex].insertCell(x);
                FragTable.rows[RowIndex].cells[x].innerHTML = `<td>${FragmentPermutations[i][x].Name}</td>`;
            }
            RowIndex++;
        }   
    }
}

function SetListAvailableRelicsPerRow()
{
    let TempListRelicCount = [];
    for(var i = 0; i < RelicsOfFragmentsinRows.length; i++)
    {
        TempListRelicCount = [];
     for(var x = 0; x < RelicsOfFragmentsinRows[i].length; x++)
        {
            TempListRelicCount.push(RelicsOfFragmentsinRows[i][x][0].ID);
            TempListRelicCount.push(RelicsOfFragmentsinRows[i][x][1].ID);
        }

        ListOfIndexesFromFilter.push(i);
        //Every Row Count Each Relic effect
        const countUnique = TempListRelicCount => {
            const counts = {};
            for (var i = 0; i < TempListRelicCount.length; i++) {
               counts[TempListRelicCount[i]] = 1 + (counts[TempListRelicCount[i]] || 0);
            };
            return counts;
         };
         ListOfAvailableRelicsPerRow.push(countUnique(TempListRelicCount));
     }
     //console.log(ListOfAvailableRelicsPerRow);
     ConvertListOfRowIDsToNames();
}

function ConvertListOfRowIDsToNames()
{
    var TempRelic;
    var RelicsInRow = [];
    ConvertedListOfRelicIDsToNamesPerRow = [];
    for(var i = 0; i < ListOfAvailableRelicsPerRow.length; i++)
    {
        RelicsInRow = [];
        Object.keys(ListOfAvailableRelicsPerRow[i]).forEach(key => {
            TempRelic = Relics.find(x => x.ID == key);
            if(ListOfAvailableRelicsPerRow[i][key] >= TempRelic.MinLevel)
            {
                if(ListOfAvailableRelicsPerRow[i][key] >= TempRelic.MaxLevel)
                {
                    RelicsInRow.push(`${TempRelic.Name}(${TempRelic.MaxLevel})`);
                }
                else
                {
                    RelicsInRow.push(`${TempRelic.Name}(${TempRelic.MinLevel})`);
                }
            }
          });
          ConvertedListOfRelicIDsToNamesPerRow.push(RelicsInRow);
    } 
    //console.log(ConvertedListOfRelicIDsToNamesPerRow);
}

function GetAllChosenFragments(){
    let RelicIDArray = [];
    let ChosenFragments = [];
    for(var i = 0; i < document.getElementById('RelicCalcTable').tBodies[0].rows.length; i++)
    {
        RelicIDArray.push(document.getElementById('RelicCalcTable').tBodies[0].rows[i].cells[0].innerHTML);
    }

    if(RelicIDArray.length > 0)
    {
        ChosenFragments = GetAllFragmentsPerRelic(RelicIDArray);
    }

    return ChosenFragments;
}

function GetAllFragmentsPerRelic(_ChosenRelicIDs)
{
    var FoundFragments = [];
    var ListOfFrags = [];
    _ChosenRelicIDs.forEach(x => {
        FoundFragments.push(Fragments.filter(y => y.RelicOneID.ID == x || y.RelicTwoID.ID == x));
    });
    FoundFragments.forEach(x => {
        x.forEach(y => {
            if(ListOfFrags.find(Frg => Frg.ID === y.ID) === undefined)
                ListOfFrags.push(y);
        });
    });

    return ListOfFrags;
}

async function Permutations(arra, arra_size)
 {
    var result_set = [],
        result;
   
   
for(var x = 0; x < Math.pow(2, arra.length); x++)
  {
    result = [];
    i = arra.length - 1;
     do
      {
      if( (x & (1 << i)) !== 0)
          {
             result.push(arra[i]);
           }
        }  while(i--);

    if( result.length == arra_size)
       {
            result_set.push(result);
        }
    }

    FragmentPermutations = result_set;
    return result_set;
}

function UpdateText(DisplayMessage)
{
    setTimeout(function(){
        if(DisplayMessage)
        {
            document.getElementById('DisplayMessage').innerHTML = `<h1 style="color:red;">After clicking "Run", it is not broke! Might take some time depending amount of combinations!</h1>`;
        }
        else
        {
            document.getElementById('DisplayMessage').innerHTML = '';
        }
    }, 100);
}

//Sanity Check Function, but slick, so keeping it I guess
function RemoveDupesFromArrayOfArrays(Array)
{
    let RelicsOne = [];
    let RelicsTwo = [];
    for(var x = 0; x < Array.length; x++)
    {
        RelicsOne = [];
        for(var o = 0; o < Array[x].length; o++)
        {
            RelicsOne.push(Array[x][o].Name);
        }
        y=x+1;
        for(y; y < Array.length; y++)
        {
            RelicsTwo = [];
            for(var t = 0; t < Array[y].length; t++)
            {
                RelicsTwo.push(Array[y][t].Name);
            }
            if(checker(RelicsOne, RelicsTwo))
            {
                delete Array[y];
            }
        }
    }

    return Array;
}



function PopulateFragments(){
    Fragments.push(new Fragment(1,"Alchemaniac", null, null));
    Fragments.push(new Fragment(2,"Arcane Conduit", null, null));
    Fragments.push(new Fragment(3,"Armadylean Decree", null, null));
    Fragments.push(new Fragment(4,"Bandosian Might", null, null));
    Fragments.push(new Fragment(5,"Barbarian Pest Wars", null, null));
    Fragments.push(new Fragment(6,"Bottomless Quiver", null, null));
    Fragments.push(new Fragment(7,"Catch Of The Day", null, null));
    Fragments.push(new Fragment(8,"Certified Farmer", null, null));
    Fragments.push(new Fragment(9,"Chef's Catch", null, null));
    Fragments.push(new Fragment(10,"Chinchonkers", null, null));
    Fragments.push(new Fragment(11,"Clued In", null, null));
    Fragments.push(new Fragment(12,"Deeper Pockets", null, null));
    Fragments.push(new Fragment(13,"Dine & Dash", null, null));
    Fragments.push(new Fragment(14,"Divine Restoration", null, null));
    Fragments.push(new Fragment(15,"Dragon On A Bit", null, null));
    Fragments.push(new Fragment(16,"Enchanted Jeweler", null, null));
    Fragments.push(new Fragment(17,"Golden Brick Road", null, null));
    Fragments.push(new Fragment(18,"Grave Robber", null, null));
    Fragments.push(new Fragment(19,"Homewrecker", null, null));
    Fragments.push(new Fragment(20,"Hot On The Trail", null, null));
    Fragments.push(new Fragment(21,"Imcando's Apprentice", null, null));
    Fragments.push(new Fragment(22,"Just Druid!", null, null));
    Fragments.push(new Fragment(23,"Larger Recharger", null, null));
    Fragments.push(new Fragment(24,"Livin' On A Prayer", null, null));
    Fragments.push(new Fragment(25,"Message In A Bottle", null, null));
    Fragments.push(new Fragment(26,"Mixologist", null, null));
    Fragments.push(new Fragment(27,"Molten Miner", null, null));
    Fragments.push(new Fragment(28,"Mother's Magic Fossils", null, null));
    Fragments.push(new Fragment(29,"Plank Stretcher", null, null));
    Fragments.push(new Fragment(30,"Praying Respects", null, null));
    Fragments.push(new Fragment(31,"Pro Tips", null, null));
    Fragments.push(new Fragment(32,"Profletchional", null, null));
    Fragments.push(new Fragment(33,"Rock Solid", null, null));
    Fragments.push(new Fragment(34,"Rogues' Chompy Farm", null, null));
    Fragments.push(new Fragment(35,"Rooty Tooty 2x Runeys", null, null));
    Fragments.push(new Fragment(36,"Rumple-Bow-String", null, null));
    Fragments.push(new Fragment(37,"Rune Escape", null, null));
    Fragments.push(new Fragment(38,"Saradominist Defence", null, null));
    Fragments.push(new Fragment(39,"Seedy Business", null, null));
    Fragments.push(new Fragment(40,"Slash & Burn", null, null));
    Fragments.push(new Fragment(41,"Slay 'n' Pay", null, null));
    Fragments.push(new Fragment(42,"Slay All Day", null, null));
    Fragments.push(new Fragment(43,"Smithing Double", null, null));
    Fragments.push(new Fragment(44,"Smooth Criminal", null, null));
    Fragments.push(new Fragment(45,"Special Discount", null, null));
    Fragments.push(new Fragment(46,"Superior Tracking", null, null));
    Fragments.push(new Fragment(47,"Tactical Duelist", null, null));
    Fragments.push(new Fragment(48,"Thrall Damage", null, null));
    Fragments.push(new Fragment(49,"Unholy Ranger", null, null));
    Fragments.push(new Fragment(50,"Unholy Warrior", null, null));
    Fragments.push(new Fragment(51,"Unholy Wizard", null, null));
    Fragments.push(new Fragment(52,"Venomaster", null, null));
    Fragments.push(new Fragment(53,"Zamorakian Sight", null, null));
}

function PopulateRelics(){
    Relics.push(new Relic(0,"Absolute Unit", 2, 3, new Array()));
    Relics.push(new Relic(1,"The Alchemist", 3, 3, new Array()));
    Relics.push(new Relic(2,"Chain Magic", 2, 3, new Array()));
    Relics.push(new Relic(3,"The Craftsman", 3, 3, new Array()));
    Relics.push(new Relic(4,"Double Tap", 2,3,new Array()));
    Relics.push(new Relic(5,"Drakan's Touch",2,3,new Array()));
    Relics.push(new Relic(6,"Endless Knowledge",3,3,new Array()));
    Relics.push(new Relic(7,"Fast Metabolism",2,2,new Array()));
    Relics.push(new Relic(8,"Greedy Gatherer",2,3,new Array()));
    Relics.push(new Relic(9,"Knifes Edge",2,3,new Array()));
    Relics.push(new Relic(10,"Last Recall",4,4,new Array()));
    Relics.push(new Relic(11,"Personal Banker",2,3,new Array()));
    Relics.push(new Relic(12,"TrailBlazer",3,3,new Array()));
    Relics.push(new Relic(13,"Twin Strikes",2,3,new Array()));
    Relics.push(new Relic(14,"Unchained Talent",3,3,new Array()));
}

function MixAndMatch(){
    // Relics[0]._Fragments = [Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[]];
    // Relics[1]._Fragments = [Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[]];
    // Relics[2]._Fragments = [Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[]];
    // Relics[3]._Fragments = [Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[]];
    // Relics[4]._Fragments = [Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[]];
    // Relics[5]._Fragments = [Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[]];
    // Relics[6]._Fragments = [Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[]];
    // Relics[7]._Fragments = [Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[]];
    // Relics[8]._Fragments = [Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[]];
    // Relics[9]._Fragments = [Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[]];
    // Relics[10]._Fragments = [Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[]];
    // Relics[11]._Fragments = [Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[]];
    // Relics[12]._Fragments = [Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[]];
    // Relics[13]._Fragments = [Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[]];
    // Relics[14]._Fragments = [Fragments[], Fragments[], Fragments[], Fragments[], Fragments[], Fragments[]];      Fragments[0].SetRelics(Relics[6], Relics[11]);
    Fragments[0].SetRelics(Relics[6], Relics[11]);
    Fragments[1].SetRelics(Relics[6], Relics[12]);
    Fragments[2].SetRelics(Relics[4], Relics[0]);
    Fragments[3].SetRelics(Relics[13], Relics[7]);
    Fragments[4].SetRelics(Relics[13], Relics[9]);
    Fragments[5].SetRelics(Relics[9], Relics[12]);
    Fragments[6].SetRelics(Relics[11], Relics[14]);
    Fragments[7].SetRelics(Relics[8], Relics[1]);
    Fragments[8].SetRelics(Relics[8], Relics[12]);
    Fragments[9].SetRelics(Relics[4], Relics[10]);
    Fragments[10].SetRelics(Relics[10], Relics[5]);
    Fragments[11].SetRelics(Relics[2], Relics[11]);
    Fragments[12].SetRelics(Relics[1], Relics[14]);
    Fragments[13].SetRelics(Relics[0], Relics[13]);
    Fragments[14].SetRelics(Relics[3], Relics[0]);
    Fragments[15].SetRelics(Relics[10], Relics[6]);
    Fragments[16].SetRelics(Relics[1], Relics[12]);
    Fragments[17].SetRelics(Relics[7], Relics[3]);
    Fragments[18].SetRelics(Relics[1], Relics[10]);
    Fragments[19].SetRelics(Relics[7], Relics[2]);
    Fragments[20].SetRelics(Relics[3], Relics[2]);
    Fragments[21].SetRelics(Relics[1], Relics[8]);
    Fragments[22].SetRelics(Relics[7], Relics[5]);
    Fragments[23].SetRelics(Relics[9], Relics[13]);
    Fragments[24].SetRelics(Relics[9], Relics[8]);
    Fragments[25].SetRelics(Relics[1], Relics[14]);
    Fragments[26].SetRelics(Relics[8], Relics[11]);
    Fragments[27].SetRelics(Relics[2], Relics[6]);
    Fragments[28].SetRelics(Relics[14], Relics[6]);
    Fragments[29].SetRelics(Relics[9], Relics[5]);
    Fragments[30].SetRelics(Relics[3], Relics[4]);
    Fragments[31].SetRelics(Relics[3], Relics[10]);
    Fragments[32].SetRelics(Relics[8], Relics[7]);
    Fragments[33].SetRelics(Relics[4], Relics[14]);
    Fragments[34].SetRelics(Relics[10], Relics[2]);
    Fragments[35].SetRelics(Relics[3], Relics[4]);
    Fragments[36].SetRelics(Relics[10], Relics[0]);
    Fragments[37].SetRelics(Relics[0], Relics[9]);
    Fragments[38].SetRelics(Relics[11], Relics[12]);
    Fragments[39].SetRelics(Relics[8], Relics[14]);
    Fragments[40].SetRelics(Relics[13], Relics[10]);
    Fragments[41].SetRelics(Relics[9], Relics[1]);
    Fragments[42].SetRelics(Relics[11], Relics[4]);
    Fragments[43].SetRelics(Relics[12], Relics[10]);
    Fragments[44].SetRelics(Relics[13], Relics[5]);
    Fragments[45].SetRelics(Relics[10], Relics[0]);
    Fragments[46].SetRelics(Relics[13], Relics[0]);
    Fragments[47].SetRelics(Relics[2], Relics[6]);
    Fragments[48].SetRelics(Relics[4], Relics[5]);
    Fragments[49].SetRelics(Relics[9], Relics[12]);
    Fragments[50].SetRelics(Relics[2], Relics[5]);
    Fragments[51].SetRelics(Relics[7], Relics[0]);
    Fragments[52].SetRelics(Relics[2], Relics[5]);
}



class Fragment{
    constructor(ID, Name, RelicOneID, RelicTwoID)
    {
        this.ID = ID;
        this.Name = Name;
        this.RelicOneID = RelicOneID;
        this.RelicTwoID = RelicTwoID;
    }

    SetRelics(_RelicOneID, _RelicTwoID)
    {
        this.RelicOneID = _RelicOneID;
        this.RelicTwoID = _RelicTwoID;
    }
}

class Relic{
    constructor(ID, Name, MinLevel, MaxLevel, _Fragments)
    {
        this.ID = ID;
        this.Name = Name;
        this.MinLevel = MinLevel;
        this.MaxLevel = MaxLevel;
        this._Fragments = _Fragments;
    }
}