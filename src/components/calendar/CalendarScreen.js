import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Swal from 'sweetalert2'

import { Navbar } from '../ui/Navbar';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es-us'
import { uiOpenModal } from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive, eventStartLoading } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

moment.locale('es')
const localizer = momentLocalizer(moment); // or globalizeLocalizer




export const CalendarScreen = () => {

    const dispatch = useDispatch();

    const {events, activeEvent} = useSelector( state => state.calendar );
    const { uid } = useSelector(state => state.auth)

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month')

    useEffect(() => {
        dispatch(eventStartLoading())        
    }, [dispatch])

    const onDoubleClick = () => {
        dispatch( uiOpenModal() );
    }

    const doubleClickAdd = (e) => {
        if(e.start.getTime() < Date.now() ){
            return Swal.fire('Error', 'La fecha de inicio debe ser mayor a hoy', 'error')
        }
        // CHECK!!!!
        const objeto = {
            title: '',
            notes: '',
            start: e.start,
            end: e.end,
        }
        dispatch(eventSetActive(objeto))
        dispatch(uiOpenModal())

    }

    const onSelectEvent = (e) => {
        dispatch(eventSetActive(e))
    }

    const onViewChange = (e) => {
        setLastView(e)
        localStorage.setItem('lastView', e);
    }

    const onSelectSlot = (e) => {
        dispatch( eventClearActiveEvent() )

        if(e.action === "doubleClick"){
            doubleClickAdd(e)
        }
    }

    const eventStyleGetter = ( event, start, end, isSelected ) => {

        const style = {
            backgroundColor: (uid === event.user._id ) ? '#367cf7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white'
            
        }

        return {style}

    }


    return (
        <div className="calendar-screen">
            <Navbar/>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                components={{
                    event:CalendarEvent
                }}
                onDoubleClickEvent = {onDoubleClick}
                onSelectEvent={onSelectEvent}
                onView = { onViewChange }
                onSelectSlot={onSelectSlot}
                selectable={true}
                view ={ lastView }
                
                
            />

            {(activeEvent) && <DeleteEventFab/>}
            <AddNewFab/>   
            <CalendarModal/>
        </div>
    )
}
