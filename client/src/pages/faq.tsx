import { useState } from "react";
import {SelectedPage, FaqType} from "../shared/types";
import {motion} from "framer-motion";
import {FaqList} from "../shared/data.ts";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Faq = ({setSelectedPage}: Props) => {
    const [dropdownToggledIndex, setDropdownToggledIndex] = useState<number | null>(null);
    const handleDropdownToggle = (index: number): void => {
        if (index === dropdownToggledIndex) {
            setDropdownToggledIndex(null);
            return;
        }
        setDropdownToggledIndex(index);
    }
    return (
        <section id="faq">
            <motion.div
                className=" bg-[url(assets/mainBg.png)] h-full"
                onViewportEnter={() => setSelectedPage(SelectedPage.FAQ)}
            >
                <motion.div
                    className="mx-auto flex flex-col items-center justify-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once:true, amount: 0.5}}
                    transition={{ duration: 0.5 }}
                    variants={{
                        hidden: { opacity: 0, y: 50},
                        visible: {opacity: 1, y: 0}
                    }}
                >
                    <h1 className="py-4 text-4xl text-[#4C3F3F]">FAQ</h1>
                    <div className="xl:w-5/6 w-11/12 justify-center items-center grid xl:grid-cols-2 gap-4">
                        { FaqList.map((item: FaqType, index: number) => (
                            <div className="z-10 xl:py-2 3xl:py-4">
                                <button id={`faq-q-${index}`} className="bg-white rounded-2xl px-2 3xl:py-2 w-[85dvw] xl:w-full" onClick={()=> handleDropdownToggle(index)} >
                                    <h6 className="py-6 px-2 text-lg 3xl:text-2xl">{item.question}</h6>
                                </button>
                                {dropdownToggledIndex===index && (
                                    <div id={`faq-a-${index}`} className="bg-blue-200 rounded-2xl my-2 px-2 3xl:py-2 w-[85dvw] xl:w-full">
                                        <h6 className="py-6 px-2 text-lg 3xl:text-2xl">{item.answer}</h6>
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}
export default Faq
