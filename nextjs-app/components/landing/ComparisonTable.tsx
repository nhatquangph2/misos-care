"use client"

import { Check, X, Minus } from "lucide-react"

export function ComparisonTable() {
    return (
        <section className="py-16 md:py-24">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Tại sao chọn MisosCare?
                    </h2>
                    <p className="text-muted-foreground">
                        So sánh MisosCare với các phương pháp trắc nghiệm truyền thống
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[700px] border rounded-xl shadow-lg bg-background overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-bold text-base w-1/3">
                                        Tính năng
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-bold text-base text-primary w-1/3 bg-blue-50/50 dark:bg-blue-900/10 text-center border-x border-blue-100 dark:border-blue-900">
                                        MisosCare
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-bold text-base text-center w-1/3">
                                        Trắc nghiệm truyền thống
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="px-6 py-4 font-medium">Chi phí</td>
                                    <td className="px-6 py-4 text-center font-bold text-green-600 bg-blue-50/30 dark:bg-blue-900/5 border-x border-blue-100 dark:border-blue-900">
                                        Miễn phí 100%
                                    </td>
                                    <td className="px-6 py-4 text-center text-muted-foreground">
                                        Thường thu phí cao
                                    </td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-6 py-4 font-medium">Phân tích kết quả</td>
                                    <td className="px-6 py-4 text-center bg-blue-50/30 dark:bg-blue-900/5 border-x border-blue-100 dark:border-blue-900">
                                        <div className="flex items-center justify-center gap-2 font-medium text-blue-600">
                                            <Check className="h-4 w-4" /> AI MISO V3 Phân tích sâu
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-muted-foreground">
                                        Kết quả mẫu chung chung
                                    </td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-6 py-4 font-medium">Lộ trình phát triển</td>
                                    <td className="px-6 py-4 text-center bg-blue-50/30 dark:bg-blue-900/5 border-x border-blue-100 dark:border-blue-900">
                                        <div className="flex items-center justify-center gap-2 text-green-600">
                                            <Check className="h-4 w-4" />
                                            Cá nhân hóa
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2 text-red-400">
                                            <X className="h-4 w-4" />
                                            Không có
                                        </div>
                                    </td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-6 py-4 font-medium">Theo dõi tiến độ</td>
                                    <td className="px-6 py-4 text-center bg-blue-50/30 dark:bg-blue-900/5 border-x border-blue-100 dark:border-blue-900">
                                        <div className="flex items-center justify-center gap-2 text-green-600">
                                            <Check className="h-4 w-4" />
                                            Dashboard trực quan
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2 text-red-400">
                                            <X className="h-4 w-4" />
                                            Không lưu trữ
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 font-medium">Hỗ trợ người dùng</td>
                                    <td className="px-6 py-4 text-center bg-blue-50/30 dark:bg-blue-900/5 border-x border-blue-100 dark:border-blue-900">
                                        <div className="flex items-center justify-center gap-2 text-green-600">
                                            <Check className="h-4 w-4" />
                                            Mentor 1:1, Cộng đồng
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-muted-foreground">
                                        <Minus className="h-4 w-4 mx-auto" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}
