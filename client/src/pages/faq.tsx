import { useState } from "react";
import {SelectedPage, FaqType} from "../shared/types";
import {motion} from "framer-motion";
import {FaqList} from "../shared/data.ts";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Faq = ({setSelectedPage}: Props) => {
    const [isDropdownToggled, setDropdownToggled] = useState<boolean>(false);
    const [toggledIndex, setToggledIndex] = useState<number>(0);
    return (
        <section id="game">
            <motion.div
                className=" bg-[url(assets/mainBg.png)] md:h-[80dvh]"
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
                    <h1 className="py-6 text-4xl text-[#4C3F3F]">FAQ</h1>
                    <div className="md:w-3/5 justify-center items-center grid grid-cols-2 gap-4">
                        { FaqList.map((item: FaqType, index: number) => (
                            <div className="z-10">
                                <button id={`faq-q-${index}`} className="bg-white rounded-3xl w-full" onClick={()=> setDropdownToggled(!isDropdownToggled)} >
                                    <h6 className="py-8 text-xl">{item.question}</h6>
                                </button>
                                {isDropdownToggled && (
                                    <div id={`faq-a-${index}`} className="bg-white rounded-3xl my-2">
                                        <h6 className="py-8 text-xl">{item.answer}</h6>
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
