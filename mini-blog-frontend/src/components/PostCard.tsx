import { FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

type Props = {
    id: string;
    title: string;
    content: string;
    date?: string | null;
    onDelete?: (id: string) => void;
};

export default function PostCard({ id, title, content, date, onDelete }: Props) {
    const dateObj = date ? new Date(date) : null;
    const isValidDate = dateObj instanceof Date && !isNaN(dateObj.getTime());

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-full break-words"
        >
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-800 mb-4 whitespace-pre-wrap">{content}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                    {isValidDate
                        ? dateObj.toLocaleString('uk-UA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                        : 'Дата відсутня'}
                </div>
                {onDelete && (
                    <motion.button
                        onClick={() => onDelete(id)}
                        whileHover={{ scale: 1.1, color: '#ef4444' }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 focus:outline-none"
                        aria-label="Delete post"
                    >
                        <FiTrash2 size={18} />
                        <span>Delete</span>
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
