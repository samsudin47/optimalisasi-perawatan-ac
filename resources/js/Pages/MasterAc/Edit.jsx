import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Head, useForm } from "@inertiajs/react";

export default function MasterAcEdit({ masterAcModel }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            code_ac: masterAcModel.code_ac,
            merk: masterAcModel.merk,
            type: masterAcModel.type,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("master-ac.update", masterAcModel), {
            preserveScroll: true,
            onSuccess: () => {
                alert("AC created successfully");
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
            <Head title="Master Data AC" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4"></div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <section className="max-w-xl">
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Updated Data AC
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Updated a new Data AC
                                    </p>
                                </header>

                                <form
                                    onSubmit={submit}
                                    className="mt-6 space-y-6"
                                >
                                    <div>
                                        <InputLabel
                                            htmlFor="code_ac"
                                            value="Kode AC"
                                        />

                                        <TextInput
                                            id="code_ac"
                                            className="mt-1 block w-full"
                                            value={data.code_ac}
                                            onChange={(e) =>
                                                setData(
                                                    "code_ac",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            isFocused
                                            autoComplete="code_ac"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.code_ac}
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
                                            htmlFor="type"
                                            value="Tipe"
                                        />

                                        <TextInput
                                            id="type"
                                            className="mt-1 block w-full"
                                            value={data.type}
                                            onChange={(e) =>
                                                setData("type", e.target.value)
                                            }
                                            required
                                            isFocused
                                            autoComplete="type"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.type}
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
