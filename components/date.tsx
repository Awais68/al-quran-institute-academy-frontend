
import { useState } from 'react';
import DatePicker from 'react-date-picker';


type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Calender() {
    const [value, onChange] = useState<Value>(new Date());

    return (
        <div>
            <DatePicker onChange={onChange} value={value} />
        </div>
    );
}