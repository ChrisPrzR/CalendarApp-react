import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2'

import centerModalStyles from '../../helpers/centerModalStyles.js';
import { uiCloseModal } from '../../actions/ui.js';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from '../../actions/events.js';

Modal.setAppElement('#root')

const now = moment().minutes(0).second(0).add( 1, 'hours');
const endDate = moment(now).add(1, 'hours')

const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: endDate.toDate()
}

export const CalendarModal = () => {

    const { modalOpen } = useSelector( state => state.ui ); 
    const { activeEvent } = useSelector( state => state.calendar )
    const dispatch = useDispatch();

    const [dateStart, setDateStart] = useState(now.toDate());
    const [dateEnd, setDateEnd] = useState(endDate.toDate());
    const [titleValid, setTitleValid] = useState(true)

    const [formValues, setFormValues] = useState(initEvent);

    const { notes, title, start, end} = formValues;

    useEffect(() => {
        if ( activeEvent ){
            setFormValues( activeEvent )
            setDateStart(activeEvent.start)
            setDateEnd(activeEvent.end)
        }else{
            setFormValues( initEvent )
            setDateStart( now.toDate() )
            setDateEnd( endDate.toDate() )
        }
    }, [activeEvent, setFormValues, setDateEnd,setDateStart])

    const handleInputChange = ({target}) => { //destructuring e.target

        setFormValues({
            ...formValues, //spreading formValues
            [target.name]: target.value //va entre llaves para sacar el valor de la propiedad
        })
    }

    const closeModal = () => {
        dispatch(uiCloseModal())
        dispatch( eventClearActiveEvent() )
        setFormValues(initEvent)
    };

    const handleStartDateChange = (e) => {
        setDateStart(e);
        setFormValues({
            ...formValues,
            start: e
        })
        console.log(e)
    };

    const handleEndDateChange = (e) => {
        setDateEnd(e)
        setFormValues({
            ...formValues,
            end: e
        })
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();

        const momentStart = moment(start);
        const momentEnd = moment(end);
        
        if( momentStart.isSameOrAfter( momentEnd ) ){
            return Swal.fire('Error', 'La fecha fin debe ser mayor a la fecha de inicio', 'error')
        }

        if(momentStart.isBefore(now)){
            return Swal.fire('Error', 'La fecha de inicio debe ser mayor a hoy', 'error')
        }

        if( title.trim().length < 2 ){
            return setTitleValid(false)
        }

        //Need to send to db
        if(activeEvent && activeEvent.title){
            dispatch( eventStartUpdate(formValues))
        }else{
            dispatch(eventStartAddNew(formValues))
        }

        setTitleValid(true);
        closeModal();
    }

    return (
        <Modal
          isOpen={modalOpen}
        //   onAfterOpen={setisOpen}
          onRequestClose={closeModal}
          style={centerModalStyles}
          className="modal"
          overlayClassName="modal-fondo"
          closeTimeoutMS={200}
        >
            <h1>{(activeEvent)? 'Editar evento' : 'Nuevo Evento'}</h1>
            <hr />
            <form 
                className="container"
                onSubmit={ handleSubmitForm }
            >
            
                <div className="form-group">
                    <label>Start date and time</label>
                    <DateTimePicker
                        onChange={handleStartDateChange}
                        value={dateStart}
                        minDate={dateStart}
                        className="form-control"
                    />    
                </div>
            
                <div className="form-group">
                    <label>End date and time</label>
                    <DateTimePicker
                        onChange={handleEndDateChange}
                        value={dateEnd}
                        minDate={dateStart}
                        className="form-control"
                    />    
                </div>
            
                <hr />
                <div className="form-group">
                    <label>Title and notes</label>
                    <input 
                        type="text" 
                        className={`form-control ${ !titleValid && 'is-invalid'} `}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={ title }
                        onChange={ handleInputChange }
                    />
                    <small id="emailHelp" className="form-text text-muted">Short description</small>
                </div>
            
                <div className="form-group">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={ notes }
                        onChange={ handleInputChange }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Additional information</small>
                </div>
            
                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Save </span>
                </button>
            
            </form>
        </Modal>
    )
}
