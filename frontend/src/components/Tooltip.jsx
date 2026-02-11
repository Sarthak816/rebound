import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

const Tooltip = ({ text, children, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="cursor-help"
            >
                {children}
            </div>
            {isVisible && (
                <div
                    className={`absolute ${positions[position]} z-50 px-3 py-2 text-xs text-white bg-academic-800 rounded-lg shadow-lg whitespace-nowrap animate-fadeIn`}
                    style={{ maxWidth: '250px', whiteSpace: 'normal' }}
                >
                    {text}
                    <div
                        className={`absolute w-2 h-2 bg-academic-800 transform rotate-45 ${position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
                                position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
                                    position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
                                        'left-[-4px] top-1/2 -translate-y-1/2'
                            }`}
                    ></div>
                </div>
            )}
        </div>
    );
};

const InfoTooltip = ({ text, position = 'top' }) => {
    return (
        <Tooltip text={text} position={position}>
            <HelpCircle size={14} className="text-academic-400 hover:text-academic-600 transition-colors inline-block" />
        </Tooltip>
    );
};

export { Tooltip, InfoTooltip };
