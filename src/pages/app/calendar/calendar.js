
import Page from "../../page.js";

import './calendar.css';



const Content = (props) => {
  

  return (
    <div className="Calendar">
      Calendar
    </div>
  );
};

const Calendar = (props) => (
  <Page header={true} footer={false} content={<Content />} />
);

export default Calendar;
