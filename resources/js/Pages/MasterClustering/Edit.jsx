import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Head, useForm } from "@inertiajs/react";

export default function MasterClusterEdit({ master_clustering }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            code_clustering: master_clustering.code_clustering,
            information: master_clustering.information,
            description: master_clustering.description,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("master-clustering.update", master_clustering), {
            preserveScroll: true,
            onSuccess: () => {
                alert("Cluster updated successfully");
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
                    Master Data Clustering
                </h2>
            }
        >
            <Head title="Master Data Cluster" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4"></div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <section className="max-w-xl">
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Updated Data Cluster
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Updated a new Data Cluster
                                    </p>
                                </header>

                                <form
                                    onSubmit={submit}
                                    className="mt-6 space-y-6"
                                >
                                    <div>
                                        <InputLabel
                                            htmlFor="code_clustering"
                                            value="Kode Cluster"
                                        />

                                        <TextInput
                                            id="code_clustering"
                                            className="mt-1 block w-full"
                                            value={data.code_clustering}
                                            onChange={(e) =>
                                                setData(
                                                    "code_clustering",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            isFocused
                                            autoComplete="code_clustering"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.code_clustering}
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

                                    <div>
                                        <InputLabel
                                            htmlFor="description"
                                            value="Deskripsi"
                                        />

                                        <TextInput
                                            id="description"
                                            className="mt-1 block w-full"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            isFocused
                                            autoComplete="description"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.description}
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
