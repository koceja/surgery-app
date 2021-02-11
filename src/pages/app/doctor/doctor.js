
import Page from "../../page.js";

import './doctor.css';



const Content = (props) => {
  

  return (
    <div className="Calendar">
      Ask Doctor
    </div>
  );
};

const Doctor = (props) => (
  <Page header={true} footer={false} content={<Content />} />
);

export default Doctor;
