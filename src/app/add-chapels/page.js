"use client"; // caso esteja usando app directory

import { useState } from "react";

export default function AddChapel() {
  const [chapel, setChapel] = useState({
    name: "",
    address: "",
    contact_email: "",
    contact_phone: "",
    schedule: [{ day: "", time: "", type: "" }],
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChapel({ ...chapel, [name]: value });
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...chapel.schedule];
    newSchedule[index][field] = value;
    setChapel({ ...chapel, schedule: newSchedule });
  };

  const addSchedule = () => {
    setChapel({
      ...chapel,
      schedule: [...chapel.schedule, { day: "", time: "", type: "" }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Chapel data:", chapel);
    // aqui você faria fetch para enviar os dados para backend
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#800020] mb-4">
        Adicionar Capela
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={chapel.name}
          onChange={handleChange}
          placeholder="Nome da Capela"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="address"
          value={chapel.address}
          onChange={handleChange}
          placeholder="Endereço"
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="contact_email"
          value={chapel.contact_email}
          onChange={handleChange}
          placeholder="Email de contato"
          className="border p-2 rounded"
        />
        <input
          type="tel"
          name="contact_phone"
          value={chapel.contact_phone}
          onChange={handleChange}
          placeholder="Telefone"
          className="border p-2 rounded"
        />

        <div>
          <h2 className="text-lg font-semibold text-[#800020] mb-2">
            Horários
          </h2>
          {chapel.schedule.map((s, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Dia"
                value={s.day}
                onChange={(e) =>
                  handleScheduleChange(index, "day", e.target.value)
                }
                className="border p-2 rounded flex-1"
              />
              <input
                type="time"
                placeholder="Hora"
                value={s.time}
                onChange={(e) =>
                  handleScheduleChange(index, "time", e.target.value)
                }
                className="border p-2 rounded flex-1"
              />
              <input
                type="text"
                placeholder="Tipo (Missa, Adoração...)"
                value={s.type}
                onChange={(e) =>
                  handleScheduleChange(index, "type", e.target.value)
                }
                className="border p-2 rounded flex-1"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addSchedule}
            className="bg-[#800020] text-white px-4 py-2 rounded"
          >
            Adicionar Horário
          </button>
        </div>

        <button
          type="submit"
          className="bg-[#800020] text-white px-4 py-2 rounded mt-4"
        >
          Salvar Capela
        </button>
      </form>
    </div>
  );
}
