import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

import Head from '../components/Head'
const STORAGE_KEY = 'claude_1_plan4';

const CalendarScheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventInput, setEventInput] = useState({ date: '', content: '' });
  const [editingEventId, setEditingEventId] = useState(null);

  // LocalStorage からデータを読み込む
  useEffect(() => {
    const savedEvents = localStorage.getItem(STORAGE_KEY);
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error('Failed to load events from localStorage:', error);
      }
    }
  }, []);

  // イベントが変更されたら LocalStorage に保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(clickedDate);
    setEventInput({ date: formatDate(clickedDate), content: '' });
    setEditingEventId(null);
    setIsModalOpen(true);
  };

  const handleEventEdit = (eventId) => {
    const event = events[eventId];
    setSelectedDate(new Date(event.date));
    setEventInput({ date: event.date, content: event.content });
    setEditingEventId(eventId);
    setIsModalOpen(true);
  };

  const handleEventDelete = (eventId) => {
    if (window.confirm('予定を削除してもよろしいですか？')) {
      const newEvents = { ...events };
      delete newEvents[eventId];
      setEvents(newEvents);
    }
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const eventId = editingEventId || Date.now().toString();
    setEvents({
      ...events,
      [eventId]: {
        date: eventInput.date,
        content: eventInput.content
      }
    });
    setIsModalOpen(false);
    setEventInput({ date: '', content: '' });
    setEditingEventId(null);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // 月の最初の日までの空セル
    for (let i = 0; i < firstDay; i++) {
      days.push(<td key={`empty-${i}`} className="border p-2"></td>);
    }

    // カレンダーの日付
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dateStr = formatDate(date);
      const dayEvents = Object.entries(events).filter(([_, event]) => event.date === dateStr);

      days.push(
        <td key={day} className="border p-2 align-top min-h-24 h-24">
          <div className="flex flex-col h-full">
            <button
              onClick={() => handleDateClick(day)}
              className="text-left font-normal hover:bg-gray-100 p-1 rounded"
            >
              {day}
            </button>
            <div className="flex-1 overflow-y-auto">
              {dayEvents.map(([eventId, event]) => (
                <div
                  key={eventId}
                  className="bg-blue-100 p-1 mb-1 rounded text-sm relative group cursor-pointer"
                >
                  <div className="group-hover:hidden truncate">{event.content}</div>
                  <div className="hidden group-hover:flex gap-1 absolute top-0 right-0 bg-white p-1 rounded shadow">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventEdit(eventId);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1"
                    >
                      編集
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventDelete(eventId);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </td>
      );
    }

    return days;
  };

  const renderCalendarRows = () => {
    const days = renderCalendarDays();
    const rows = [];
    let cells = [];

    days.forEach((day, i) => {
      if (i % 7 === 0 && cells.length > 0) {
        rows.push(<tr key={i}>{cells}</tr>);
        cells = [];
      }
      cells.push(day);
    });

    if (cells.length > 0) {
      while (cells.length < 7) {
        cells.push(<td key={`empty-end-${cells.length}`} className="border p-2"></td>);
      }
      rows.push(<tr key={cells.length}>{cells}</tr>);
    }

    return rows;
  };

  return (
  <>
    <Head />
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrevMonth}>&lt;</Button>
        <h2 className="text-xl font-bold">
          {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
        </h2>
        <Button onClick={handleNextMonth}>&gt;</Button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-red-500">日</th>
            <th className="border p-2">月</th>
            <th className="border p-2">火</th>
            <th className="border p-2">水</th>
            <th className="border p-2">木</th>
            <th className="border p-2">金</th>
            <th className="border p-2 text-blue-500">土</th>
          </tr>
        </thead>
        <tbody>{renderCalendarRows()}</tbody>
      </table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEventId ? '予定を編集' : '新規予定'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEventSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">日付</label>
              <Input
                type="date"
                value={eventInput.date}
                onChange={(e) => setEventInput({ ...eventInput, date: e.target.value })}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">内容</label>
              <Textarea
                value={eventInput.content}
                onChange={(e) => setEventInput({ ...eventInput, content: e.target.value })}
                required
                rows={4}
                className="w-full"
                placeholder="予定の内容を入力してください"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit">
                {editingEventId ? '更新' : '追加'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  </>

  );
};

export default CalendarScheduler;
