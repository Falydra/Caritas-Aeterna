import { useEffect, useState } from "react";
import { Payment, columns } from "@/config/cart_data";
import DataTable  from "@/config/data_cart_table";

export default function CartProduct() {
   
    return (
        <div className="flex w-full h-full text-primary-bg">
            <DataTable />
        </div>
    );
}