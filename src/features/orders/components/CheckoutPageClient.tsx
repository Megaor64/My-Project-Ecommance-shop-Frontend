"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { selectUser } from "@/features/auth/store/selectors";
import {
  selectCartItems,
  selectCartSubtotal,
} from "@/features/cart/store/selectors";
import { clearCart } from "@/features/cart/store/thunks";
import { createOrder } from "@/features/orders/store/thunks";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function CheckoutPageClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="font-lora text-warm-gray">Sign in to complete your order.</p>
        <Button asChild className="mt-6 rounded-md font-lora normal-case">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="font-lora text-warm-gray">Your bag is empty.</p>
        <Button asChild className="mt-6 rounded-md font-lora normal-case">
          <Link href="/books">Browse books</Link>
        </Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(
        createOrder({
          shippingAddress: { street, city, zip, country },
          paymentMethod: {
            cardholderName,
            cardNumber: cardNumber.replace(/\D/g, ""),
            expiration,
            cvv,
          },
        })
      ).unwrap();
      await dispatch(clearCart()).unwrap();
      toast.success("Order placed — thank you for your purchase.");
      router.push("/account");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Could not place order");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-14">
      <header className="mb-10">
        <h1 className="font-playfair text-3xl font-semibold text-ink">Checkout</h1>
        <p className="mt-2 font-lora text-warm-gray">
          Enter your shipping and payment details to complete your order.
        </p>
      </header>

      <div className="mb-8 rounded-md border border-border/60 bg-cream/50 p-6">
        <p className="font-lora text-sm text-warm-gray">
          {items.length} item{items.length === 1 ? "" : "s"} · Subtotal{" "}
          <span className="font-playfair text-ink">${subtotal.toFixed(2)}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <h2 className="font-playfair text-xl font-semibold text-ink">
            Shipping address
          </h2>
          <Field>
            <FieldLabel htmlFor="street">Street address</FieldLabel>
            <Input
              id="street"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="city">City</FieldLabel>
            <Input
              id="city"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="zip">ZIP / Postal code</FieldLabel>
              <Input
                id="zip"
                required
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="country">Country</FieldLabel>
              <Input
                id="country"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Field>
          </div>

          <h2 className="mt-4 font-playfair text-xl font-semibold text-ink">
            Payment method
          </h2>
          <Field>
            <FieldLabel htmlFor="cardholderName">Name on card</FieldLabel>
            <Input
              id="cardholderName"
              required
              autoComplete="cc-name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="cardNumber">Card number</FieldLabel>
            <Input
              id="cardNumber"
              required
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="expiration">Expiration date</FieldLabel>
              <Input
                id="expiration"
                required
                autoComplete="cc-exp"
                placeholder="MM/YY"
                pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                title="Use MM/YY format, e.g. 03/28"
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="cvv">CVV</FieldLabel>
              <Input
                id="cvv"
                required
                type="password"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                pattern="\d{3,4}"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </Field>
          </div>

          <Button
            type="submit"
            className="w-full rounded-md font-lora normal-case"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing order…" : "Place order"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
