"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeftIcon, CameraIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function AddChapel() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "",
    latitude: 0,
    longitude: 0,
    contact_phone: "",
    contact_email: "",
    description: "",
    masses: [],
    responsibles: [],
    images: [],
    celebrant_group: "",
  });

  // Pega valores da URL se vierem de search-map
  // Pega valores da URL se vierem de search-map
  useEffect(() => {
    // A remoção do 'if (!searchParams) return;' simplifica e não é necessária aqui.

    // Função auxiliar para obter um valor numérico ou retornar o valor anterior
    const getNumericParam = (key, prevValue) => {
      const param = searchParams.get(key);
      // Se o parâmetro for nulo ou uma string vazia, usa o valor anterior (prevValue)
      if (param === null || param === "") {
        return prevValue;
      }
      // Tenta converter para float; se não for um número válido (NaN), usa o valor anterior
      const value = parseFloat(param);
      return isNaN(value) ? prevValue : value;
    };

    setForm((prev) => ({
      ...prev,
      // String parameters: use the new value if available, otherwise keep the previous one
      street: searchParams.get("street") || prev.street,
      number: searchParams.get("number") || prev.number,
      neighborhood: searchParams.get("neighborhood") || prev.neighborhood,
      city: searchParams.get("city") || prev.city,
      state: searchParams.get("state") || prev.state,
      country: searchParams.get("country") || prev.country,

      // Numeric parameters: using the safer helper function
      latitude: getNumericParam("latitude", prev.latitude),
      longitude: getNumericParam("longitude", prev.longitude),
    }));
  }, [searchParams]); // Dependência correta

  const handleSelectLocation = () => {
    router.push("/search-map");
  };

  const addMass = () => {
    setForm((prev) => ({
      ...prev,
      masses: [
        ...prev.masses,
        { day_of_week: 0, time: "", mass_type: "rezada", notes: "" },
      ],
    }));
  };

  const addResponsible = () => {
    setForm((prev) => ({
      ...prev,
      responsibles: [
        ...prev.responsibles,
        { name: "", role: "", phone: "", email: "" },
      ],
    }));
  };

  const handleImagesChange = (e) => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...e.target.files],
    }));
  };

  const handleSubmit = async () => {
    const requiredFields = [
      { field: "name", label: "Nome" },
      { field: "street", label: "Rua" },
      { field: "number", label: "Número" },
      { field: "city", label: "Cidade" },
      { field: "state", label: "Estado" },
      { field: "country", label: "País" },
    ];

    // Verifica cada campo
    for (let item of requiredFields) {
      if (!form[item.field] || !form[item.field].toString().trim()) {
        alert(`O campo ${item.label} é obrigatório!`);
        return; // interrompe o envio se algum campo estiver vazio
      }
    }

    try {
      const formData = new FormData();

      [
        "name",
        "street",
        "number",
        "neighborhood",
        "city",
        "state",
        "country",
        "contact_phone",
        "contact_email",
        "description",
        "celebrant_group",
      ].forEach((key) => formData.append(key, form[key] || ""));

      formData.append("latitude", Number(form.latitude) || 0);
      formData.append("longitude", Number(form.longitude) || 0);
      formData.append("masses", JSON.stringify(form.masses));
      formData.append("responsibles", JSON.stringify(form.responsibles));

      form.images.forEach((img) => formData.append("images", img));

      const res = await fetch(
        "https://thalleslorrhan.pythonanywhere.com/api/chapels/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const error = await res.json();
        console.error("Erro da API:", error);
        alert("Erro ao adicionar capela. Veja o console.");
        return;
      }

      alert("Capela adicionada com sucesso!");
      router.push("/");
    } catch (err) {
      console.error("Erro de conexão:", err);
      alert("Erro de conexão.");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 w-[95%] mx-auto">
      <div className="flex justify-center items-center gap-4 sm:flex-row lg:w-full">
        <Link
          href={"/home"}
          className="w-12 text-[#800020] lg:text-left"
          aria-label="Voltar"
        >
          <ChevronLeftIcon />
        </Link>
        <Image src="/chapel.png" width={80} height={0} alt="Imagem da capela" />

        <h1 className="font-[Italianno] text-3xl text-[#800020] mb-2 text-center drop-shadow-lg ">
          Adicionar Capela
        </h1>
      </div>

      <div className="flex flex-col items-left">
        <h2 className="text-xl text-[#800020]">Local no Mapa</h2>
        <button
          onClick={handleSelectLocation}
          className="bg-[#800020]/80 mt-5 text-white px-3 py-2 rounded-3xl text-sm font-medium hover:bg-[#a00028] transition pointer-events-auto"
        >
          Selecionar Localização no Mapa
        </button>
      </div>

      <div className="flex flex-col items-left">
        <h2 className="text-xl text-[#800020]">Nome</h2>
        <input
          type="text"
          placeholder="Nome da Capela"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border-none p-2 mt-5 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
        />
        <h2 className="text-xl text-[#800020] mt-5">Endereço</h2>
        <input
          type="text"
          placeholder="Rua"
          value={form.street}
          onChange={(e) => setForm({ ...form, street: e.target.value })}
          className="border-none p-2 mt-5 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
        />
        <div className="flex gap-2 md:flex-row md:space-x-2">
          <input
            type="text"
            placeholder="Número"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            className="border-none p-2 mt-5 rounded-full w-[40%] bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
          />
          <input
            placeholder="Complemento"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border-none p-2 mt-5 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
          />
        </div>
        <input
          type="text"
          placeholder="Bairro"
          value={form.neighborhood}
          onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
          className="border-none p-2 mt-5 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
        />
        <input
          type="text"
          placeholder="Cidade"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="border-none p-2 mt-5 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
        />
        <input
          type="text"
          placeholder="Estado"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          className="border-none p-2 mt-5 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
        />
        <input
          type="text"
          placeholder="País"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          className="border-none p-2 mt-5 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
        />
        {/* <p>Latitude: {form.latitude ?? "não definido"}</p>
        <p>Longitude: {form.longitude ?? "não definido"}</p> */}
        {/* <input type="text" name="latitude" value={form.latitude} />
        <input type="text" name="longitude" value={form.longitude} /> */}

        <h2 className="text-xl text-[#800020] mt-5">Telefone</h2>
        <input
          type="text"
          placeholder="Telefone"
          value={form.contact_phone}
          onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
          className="border-none p-2 mt-5 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
        />

        <h2 className="text-xl text-[#800020] mt-5">E-mail</h2>
        <input
          type="email"
          placeholder="E-mail"
          value={form.contact_email}
          onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
          className="border-none p-2 mt-5 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
        />
      </div>

      {/* Horários de Missa */}
      <div className="">
        <h2 className="text-xl text-[#800020] mt-5">Horários de Missa</h2>
        {form.masses.map((m, idx) => (
          <div key={idx} className="mb-2 flex flex-col md:flex-row gap-2">
            <div className="flex gap-2 md:flex-row md:space-x-2 w-full">
              <select
                value={m.day_of_week}
                onChange={(e) => {
                  const masses = [...form.masses];
                  masses[idx].day_of_week = parseInt(e.target.value);
                  setForm({ ...form, masses });
                }}
                className="border-none p-2 mt-5 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
              >
                {[
                  "Segunda",
                  "Terça",
                  "Quarta",
                  "Quinta",
                  "Sexta",
                  "Sábado",
                  "Domingo",
                ].map((d, i) => (
                  <option key={i} value={i}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                type="time"
                value={m.time}
                onChange={(e) => {
                  const masses = [...form.masses];
                  masses[idx].time = e.target.value;
                  setForm({ ...form, masses });
                }}
                className="border-none p-2 mt-5 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
            </div>
            <select
              value={m.mass_type}
              onChange={(e) => {
                const masses = [...form.masses];
                masses[idx].mass_type = e.target.value;
                setForm({ ...form, masses });
              }}
              className="border-none p-2 mt-5 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
            >
              <option value="rezada">Rezada</option>
              <option value="cantada">Cantada</option>
              <option value="solene">Solene</option>
            </select>
          </div>
        ))}
        <button
          onClick={addMass}
          className="bg-[#800020]/80 mt-5 text-white px-3 py-2 rounded-3xl text-sm font-medium hover:bg-[#a00028] transition pointer-events-auto"
        >
          Adicionar Horário
        </button>
      </div>
      <div className="flex flex-col items-start mt-5">
        <h2 className="text-xl font-semibold text-[#800020] mb-3">
          Grupo Celebrante
        </h2>
        <input
          type="text"
          value={form.celebrant_group}
          onChange={(e) =>
            setForm({ ...form, celebrant_group: e.target.value })
          }
          placeholder="Ex: FSSPX, IBP, FSSP"
          className="border-none p-2 mt-5 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
        />
      </div>
      <div className="flex flex-col items-start mt-5">
        <h2 className="text-xl font-semibold text-[#800020] mb-3">
          Fotos da Capela
        </h2>
        <div className="flex items-center justify-between gap-4 w-full">
          <p className="text-sm text-gray-600">Anexar fotos do local</p>
          <label className="flex items-center gap-2 cursor-pointer bg-[#800020]/20 hover:bg-[#800020]/30 text-[#800020] px-4 py-2 rounded-full transition">
            <CameraIcon className="w-5 h-5" />
            Selecionar Fotos
            <input
              type="file"
              multiple
              onChange={handleImagesChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Responsáveis */}
      <div className="felex flex-col items-start mt-5 w-full">
        <h2 className="text-xl font-semibold text-[#800020] mb-3">
          Responsáveis
        </h2>
        {form.responsibles.map((r, idx) => (
          <div key={idx} className="mb-4 flex flex-col md:flex-row gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nome"
                value={r.name}
                onChange={(e) => {
                  const resp = [...form.responsibles];
                  resp[idx].name = e.target.value;
                  setForm({ ...form, responsibles: resp });
                }}
                className="border-none p-2 mt-2 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />

              {/* Função / Cargo */}
              <input
                type="text"
                placeholder="Função"
                value={r.role}
                onChange={(e) => {
                  const resp = [...form.responsibles];
                  resp[idx].role = e.target.value;
                  setForm({ ...form, responsibles: resp });
                }}
                className="border-none p-2  mt-2 rounded-full w-[50%] bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="Telefone"
              value={r.phone}
              onChange={(e) => {
                const resp = [...form.responsibles];
                resp[idx].phone = e.target.value;
                setForm({ ...form, responsibles: resp });
              }}
              className="border-none p-2 mt-2 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
            />
            <input
              type="email"
              placeholder="E-mail"
              value={r.email}
              onChange={(e) => {
                const resp = [...form.responsibles];
                resp[idx].email = e.target.value;
                setForm({ ...form, responsibles: resp });
              }}
              className="border-none p-2 mt-2 rounded-full w-full bg-gray-200 focus:ring-2 focus:ring-[#800020] focus:outline-none"
            />
          </div>
        ))}
        <button
          onClick={addResponsible}
          className="bg-[#800020]/80 mt-5 text-white px-3 py-2 rounded-3xl text-sm font-medium hover:bg-[#a00028] transition pointer-events-auto"
        >
          Adicionar Responsável
        </button>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-[#800020]/80 mt-5 text-white px-3 py-2 rounded-3xl text-sm font-medium hover:bg-[#a00028] transition pointer-events-auto"
      >
        Salvar Capela
      </button>
    </div>
  );
}
