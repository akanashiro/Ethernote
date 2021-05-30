// SPDX-License-Identifier: MIT
pragma solidity >=0.5 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Ethernote {

  struct Note{
    string strTitle;
    string strContent;
    bool isEditable;
    uint timeStamp;
  }
  
  address public addrEditor;

  Note[] public arrayNotes;

  constructor() public {
    addrEditor = msg.sender;
  }

  // Only owner can create/modify/delete a note
  modifier onlyOwner {
      require(msg.sender == addrEditor,"Only owner");
      _;
  }

  function pushNote(string memory inTitle, string memory inContent) public onlyOwner {
    /*Note newNote;
    newNote.strTitle = _aTitle;
    newNote.strContent = _aContent;
    newNote.isEditable = true;*/

    arrayNotes.push(Note({
                          strTitle: inTitle,
                          strContent: inContent,
                          isEditable: true,
                          timeStamp: block.timestamp
                          }
                    ));
  }

  /*
  function pullNote(uint aPosition) public onlyOwner {
    arrayNotes.pull()
  }
  */

  // Can only edit a Note if it is Editable
  function editNote(uint aPosition, string memory inContent) public {
    require(arrayNotes[aPosition].isEditable == true, "Note is note editable");
    arrayNotes[aPosition].strContent = inContent;
    arrayNotes[aPosition].timeStamp = block.timestamp; // Last update
  }

  // Toggle note editable/not editable
  function toggleEditable(uint aPosition) public {
    if (arrayNotes[aPosition].isEditable == true) {
        arrayNotes[aPosition].isEditable = false;
    }
    else {
        arrayNotes[aPosition].isEditable = true;
    }

  }

  // Get an specific note
  function getNote(uint aPosition) public view returns (string memory outTitle, string memory outContent, bool memory outEditable, uint memory outTimestamp){

    outTitle = arrayNotes[aPosition].strTitle;
    outContent = arrayNotes[aPosition].strContent;
    outEditable = arrayNotes[aPosition].isEditable;
    outTimestamp = arrayNotes[aPosition].timeStamp;
  }

  // Get notes
  function getNotes() public view returns (Note[] memory)
  {
    return arrayNotes;
  }

}