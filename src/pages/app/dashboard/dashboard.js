import { useEffect, useState, useContext } from "react";
import { CircularProgress } from '@material-ui/core';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';

import ApiHandler from "../../../api/client.js";
import { SessionContext } from "../../../session/session.js";
import Page from "../../page.js";

import './dashboard.css';
import { Redirect } from "react-router-dom";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

const Content = (props) => {
    const classes = useStyles();


  const [state, setState] = useState({
    loading: true,
    postTask: false,
    taskName: "",
    taskInfo: "",
    open: false,
    toDoctor: false,
    toCalendar: false,
  });

  const handleClose = () => {
    setState({ ...state, open: false});
  };

  const session = useContext(SessionContext);

  const apiHandler = new ApiHandler(session);

  useEffect(() => {
    if (state.loading) {
      apiHandler.getAccount().then((data) => {
        console.log(data);
        setState({
          ...state,
          firstName: data.first_name,
          lastName: data.last_name,
          surgery: data.surgery,
          loading: false
        });
      });
    }
    if (state.postTask) {
        if (state.surgery == null) {
            setState({ ...state, postTask: false});
        } else {
            if (state.check) {
                apiHandler.checkTask(state.surgery.surgery_id, state.task).then((data) => {
                    const newTasks = [ ...state.surgery.tasks[0]];
                    newTasks.find(task => task.task_id == state.task).completed = true;
                    const newSurgery = { ...state.surgery, tasks: { 0: newTasks}};
                    setState({
                      ...state,
                      surgery: newSurgery,
                      postTask: false,
                    });
                  });
            } else {
                apiHandler.uncheckTask(state.surgery.surgery_id, state.task).then((data) => {
                    const newTasks = [ ...state.surgery.tasks[0]];
                    newTasks.find(task => task.task_id == state.task).completed = false;
                    const newSurgery = { ...state.surgery, tasks: { 0: newTasks}};
                    setState({
                      ...state,
                      surgery: newSurgery,
                      postTask: false,
                    });
                  });
            }
        }
        
        
    }
  });

  const redirectDoctor = () => {
      console.log("here");
      setState({ ...state, toDoctor: true});
  }

  const redirectCalendar = () => {
    setState({ ...state, toCalendar: true});
    }

  const toggleTask = (taskId, completed) => {
      if (completed) {
        uncheckTask(taskId);
      } else {
        checkTask(taskId);
      }
  }

  const checkTask = (taskId) => {
    setState({
        ...state,
        postTask: true,
        check: true,
        task: taskId
    })
  }

  const uncheckTask = (taskId) => {
    setState({
        ...state,
        postTask: true,
        task: taskId,
        check: false
    })
  }

  const toggleModal = (name, info) => {
    setState({ ...state, taskName: name, taskInfo: info, open: true})
  }

  if (state.toDoctor) {
      return (<Redirect to="/app/doctor" />);
  }

  if (state.toCalendar) {
    return (<Redirect to="/app/calendar" />);
}


  if (state.loading) {
    return <div className="loading"><CircularProgress /></div>;
  }

  const date = new Date();

  return (
    <div className="Dashboard">
      <div className="dashboard-header">
          <div className="dashboard-header-info">
          <h1>{`${daysOfWeek[date.getDay()]}, ${
          months[date.getMonth()]
        } ${date.getDate()}`}</h1>
        <h2>{`${state.firstName} ${state.lastName}`}</h2>

        {state.surgery ? (
          <>
            <h2>{state.surgery.name}</h2>
            <h2>{`${Math.floor(
              (date - new Date(state.surgery.date)) / (1000 * 3600 * 24)
            )} days post operation`}</h2>
          </>
        ) : (
          <h2>You have not had any recent surgeries.</h2>
        )}
          </div>
          <div className="dashboard-header-links">
              <div onClick={redirectDoctor} className="dashboard-header-links-doctor">
                  Ask your doctor
              </div>
              <div onClick={redirectCalendar} className="dashboard-header-links-calendar">
                  Calendar
              </div>
          </div>
        
      </div>
      {state.surgery ? (
        <div className="dashboard-tasks">
          {state.surgery.tasks[0].length > 0 ? (
            state.surgery.tasks[0].map((task) => (
              <div className={`dashboard-task ${task.completed ? "completed-task" : ""}`}>
                <div className="dashboard-task-checkbox">
                  {state.postTask && state.task == task.task_id ? <CircularProgress /> : <div onClick={() => toggleTask(task.task_id, task.completed)} className={`dashboard-task-checkbox-button ${task.completed ? "completed-checkbox" : ""}`}></div>}
                </div>
                <div className="dashboard-task-name">{task.name}</div>
                <div className="dashboard-task-info" onClick={() => toggleModal(task.name, task.info)}>Info</div>
              </div>
            ))
          ) : (
            <p>You have no tasks.</p>
          )}
        </div>
      ) : null}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={state.open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={state.open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">{state.taskName}</h2>
            <p id="transition-modal-description">{state.taskInfo}</p>
          </div>
        </Fade>
      </Modal>

    </div>
  );
};

const Dashboard = (props) => (
  <Page header={true} footer={false} content={<Content />} />
);

export default Dashboard;
