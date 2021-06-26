// SPDX-License-Identifier: MIT
pragma solidity >=0.8 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Ethernote {

  struct Note{
    string strTitle;
    string strContent;
    bool isEditable;
    uint timeStamp;
  }
  
  address public addrEditor;

  Note[] private arrayNotes;

  constructor() public {
    addrEditor = msg.sender;
  }

  // Only owner can create/modify/delete a note
  modifier onlyOwner {
      require(msg.sender == addrEditor,"Only owner can interact with notes");
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
                    
    uint aPosition = arrayNotes.length;
    emit getNoteEvent(aPosition);
  }


  // Can only edit a Note if it is Editable
  function editNote(uint aPosition, string memory inContent) public onlyOwner {
    require(arrayNotes[aPosition].isEditable == true, "Note is note editable");
    arrayNotes[aPosition].strContent = inContent;
    arrayNotes[aPosition].timeStamp = block.timestamp; // Last update
  }
  
  // Event Toggle
  event toggleEvent(
      uint position,
      bool isEditable
      );

  // Toggle note editable/not editable
  function toggleEditable(uint aPosition) public onlyOwner {
    if (arrayNotes[aPosition].isEditable == true) {
        arrayNotes[aPosition].isEditable = false;
    }
    else {
        arrayNotes[aPosition].isEditable = true;
    }
    
    emit toggleEvent(aPosition, arrayNotes[aPosition].isEditable);
  }
  
  // Reset array of notes 
  function flushNotes() public onlyOwner {
      delete arrayNotes;
  }
  
  
  event deleteEvent(
      uint _Position
      );
  
  // I haven't found an cheaper way to delete a note and don't loose order
  // I think it will consume a bunch of gas if notes array is too large!
  function deleteNote(uint aPosition) public onlyOwner {
    for (uint i = aPosition; i < arrayNotes.length - 1; i++){
        arrayNotes[i] = arrayNotes[i+1];
    }
    arrayNotes.pop();
    emit deleteEvent(aPosition);
  }

  // Get an specific note
  event getNoteEvent(
      uint aPosition
      );
  
  
  function getNote(uint aPosition) public onlyOwner view returns (string memory outTitle, string memory outContent, bool outEditable, uint outTimestamp){

    outTitle = arrayNotes[aPosition].strTitle;
    outContent = arrayNotes[aPosition].strContent;
    outEditable = arrayNotes[aPosition].isEditable;
    outTimestamp = arrayNotes[aPosition].timeStamp;
  }

  // Get notes
  function getNotes() public onlyOwner view returns (Note[] memory)
  {
    return arrayNotes;
  }
    
}
