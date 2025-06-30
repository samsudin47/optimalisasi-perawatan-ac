import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Head, useForm } from "@inertiajs/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function MasterAcIndex({ data_unit_ac, list_status, list_ac }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name_customer: data_unit_ac.name_customer,
            id_ac: data_unit_ac.id_ac,
            addrees: data_unit_ac.addrees,
            phone: data_unit_ac.phone,
            date_service: data_unit_ac.date_service,
            cluster_first_id: data_unit_ac.cluster_first_id,
            cluster_second_id: data_unit_ac.cluster_second_id,
            merk: data_unit_ac.merk,
            status_id: data_unit_ac.status_id,
            information: data_unit_ac.information,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("data-unit-ac.update", data_unit_ac), {
            preserveScroll: true,
            onSuccess: () => {
                alert("Customer updated successfully");
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Master Data Ac
                </h2>
            }
        >
            <Head title="Customer" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4"></div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <section className="max-w-xl">
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Updated Data Customer
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Updated a new Data Customer
                                    </p>
                                </header>

                                <form
                                    onSubmit={submit}
                                    className="mt-6 space-y-6"
                                >
                                    <div>
                                        <InputLabel
                                            htmlFor="name_customer"
                                            value="Nama Customer"
                                        />

                                        <TextInput
                                            id="name_customer"
                                            className="mt-1 block w-full"
                                            value={data.name_customer}
                                            onChange={(e) =>
                                                setData(
                                                    "name_customer",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            isFocused
                                            autoComplete="name_customer"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.name_customer}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="id_ac"
                                            value="Merk AC"
                                        />

                                        <select
                                            id="id_ac"
                                            name="id_ac"
                                            value={data.id_ac}
                                            onChange={(e) =>
                                                setData("id_ac", e.target.value)
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="">Pilih AC</option>
                                            {list_ac.map((list) => (
                                                <option
                                                    key={list.id}
                                                    value={list.id}
                                                >
                                                    {list.code_ac} : {list.type}
                                                </option>
                                            ))}
                                        </select>

                                        <InputError
                                            message={errors.id_ac}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="addrees"
                                            value="Alamat"
                                        />

                                        <TextInput
                                            id="addrees"
                                            className="mt-1 block w-full"
                                            value={data.addrees}
                                            onChange={(e) =>
                                                setData(
                                                    "addrees",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            isFocused
                                            autoComplete="addrees"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.addrees}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="phone"
                                            value="No Telepon"
                                        />

                                        <TextInput
                                            id="phone"
                                            className="mt-1 block w-full"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            required
                                            isFocused
                                            autoComplete="phone"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.phone}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="date_service"
                                            value="Terakhir Service"
                                        />

                                        <DatePicker
                                            id="date_service"
                                            selected={
                                                data.date_service
                                                    ? new Date(
                                                          data.date_service
                                                      )
                                                    : null
                                            }
                                            onChange={(date) =>
                                                setData(
                                                    "date_service",
                                                    date
                                                        ? date
                                                              .toISOString()
                                                              .slice(0, 10)
                                                        : ""
                                                )
                                            }
                                            dateFormat="yyyy-MM-dd"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholderText="Pilih tanggal"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.date_service}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="cluster_first_id"
                                            value="Cluster Pertama"
                                        />

                                        <TextInput
                                            id="cluster_first_id"
                                            className="mt-1 block w-full"
                                            value={data.cluster_first_id}
                                            onChange={(e) =>
                                                setData(
                                                    "cluster_first_id",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            isFocused
                                            autoComplete="cluster_first_id"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.cluster_first_id}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="cluster_second_id"
                                            value="Cluster Kedua"
                                        />

                                        <TextInput
                                            id="cluster_second_id"
                                            className="mt-1 block w-full"
                                            value={data.cluster_second_id}
                                            onChange={(e) =>
                                                setData(
                                                    "cluster_second_id",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            isFocused
                                            autoComplete="cluster_second_idd"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.cluster_second_id}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="merk"
                                            value="Merk"
                                        />

                                        <TextInput
                                            id="merk"
                                            className="mt-1 block w-full"
                                            value={data.merk}
                                            onChange={(e) =>
                                                setData("merk", e.target.value)
                                            }
                                            required
                                            isFocused
                                            autoComplete="merk"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.merk}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="status_id"
                                            value="Status"
                                        />

                                        <select
                                            id="status_id"
                                            name="status_id"
                                            value={data.status_id}
                                            onChange={(e) =>
                                                setData(
                                                    "status_id",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">
                                                Pilih Status
                                            </option>
                                            {list_status.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.status}
                                                </option>
                                            ))}
                                        </select>

                                        <InputError
                                            message={errors.item}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="information"
                                            value="Keterangan"
                                        />

                                        <TextInput
                                            id="information"
                                            className="mt-1 block w-full"
                                            value={data.information}
                                            onChange={(e) =>
                                                setData(
                                                    "information",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            isFocused
                                            autoComplete="information"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.information}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <PrimaryButton disabled={processing}>
                                            Save
                                        </PrimaryButton>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-gray-600">
                                                Saved.
                                            </p>
                                        </Transition>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
