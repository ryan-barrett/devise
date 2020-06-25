import React, { useState } from 'react';
import Ticket from '../ticket/Ticket';
import AddTicketButton from '../add_ticket_button/AddTicketButton';

import './Board.css';

function Board() {
  return (
    <div>
      <h1>
        Board Name
      </h1>
      <div id="board-container">
        <div className="board-col">
          <h3>To Do</h3>
          <Ticket/>
          <Ticket/>
          <Ticket/>
          <AddTicketButton/>
        </div>
        <div className="board-col">
          <h3>In Progress</h3>
          <Ticket/>
          <Ticket/>
          <Ticket/>
          <AddTicketButton/>
        </div>
        <div className="board-col">
          <h3>Done</h3>
          <Ticket/>
          <Ticket/>
          <Ticket/>
          <Ticket/>
          <Ticket/>
          <Ticket/>
          <AddTicketButton/>
        </div>
      </div>
    </div>
  );
}

export default Board;
