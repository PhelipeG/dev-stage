"use client"
import { subscribeToEvent } from "@/http/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Mail, User } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../components/button"
import { InputField, InputIcon, InputRoot } from "../components/input"

const subscriptionSchema = z.object({
  name: z.string().min(4, "Digite seu nome completo"),
  email: z.string().email("Digite seu email completo"),
})

type subscriptionSchema = z.infer<typeof subscriptionSchema>
export function SubscriptionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<subscriptionSchema>({
    resolver: zodResolver(subscriptionSchema),
  })

  async function handleSubscribe(data: subscriptionSchema) {
    const referrer = searchParams.get("referrer")
    const { subscriberId } = await subscribeToEvent({
      email: data.email,
      name: data.name,
      referrer,
    })
    router.push(`/invite/${subscriberId}`)
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubscribe)}
      className="w-full bg-gray-700 border border-gray-600 rounded-2xl p-8 space-y-6 md:max-w-[440px]"
    >
      <h2 className="font-heading font-semibold text-gray-200 text-xl">
        Inscrição
      </h2>
      <div className="space-y-3">
        <div className="space-y-2">
          <InputRoot>
            <InputIcon>
              <User className="size-6" />
            </InputIcon>
            <InputField
              type="text"
              placeholder="Nome completo"
              {...register("name")}
            />
          </InputRoot>
          {errors?.name && (
            <p className="text-danger font-semibold text-xs">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <InputRoot>
            <InputIcon>
              <Mail className="size-6" />
            </InputIcon>
            <InputField
              type="text"
              placeholder="E-mail"
              {...register("email")}
            />
          </InputRoot>
          {errors?.email && (
            <p className="text-danger font-semibold text-xs">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>
      <Button type="submit">
        Confirmar
        <ArrowRight className="size-6" />
      </Button>
    </form>
  )
}
